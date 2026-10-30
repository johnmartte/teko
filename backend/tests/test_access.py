"""Login del CMS delegado al Planner, "mantener sesión" y passkeys (con un autenticador simulado)."""
import base64
import hashlib
import json
import os
import struct

os.environ["DATABASE_URL"] = "sqlite:///./test_cms.db"
os.environ["BACKEND_CORS_ORIGINS"] = '["https://cms.test"]'

import cbor2  # noqa: E402
import pytest  # noqa: E402
from cryptography.hazmat.primitives import hashes  # noqa: E402
from cryptography.hazmat.primitives.asymmetric import ec  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from jose import jwt  # noqa: E402

from app.core.config import settings  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import engine  # noqa: E402
from app.main import app  # noqa: E402
from app.services import planner_client  # noqa: E402

ORIGIN = {"Origin": "https://cms.test"}
b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b"=").decode()  # noqa: E731
unb64 = lambda s: base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))  # noqa: E731


@pytest.fixture()
def client(monkeypatch):
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    monkeypatch.setattr(settings, "PLANNER_API_KEY", "k")
    state = {"result": "ok", "allowed": True}
    monkeypatch.setattr(planner_client, "verify_login", lambda e, p: (state["result"], {"email": e, "name": "Ana Lopez"} if state["result"] == "ok" else {}))
    monkeypatch.setattr(planner_client, "has_cms_access", lambda e: state["allowed"])
    c = TestClient(app)
    c.state = state
    return c


def login(c, remember=False):
    return c.post(f"/api/v1/auth/login?remember={str(remember).lower()}", data={"username": "ana@teko.do", "password": "x"})


def exp_minutes(token):
    return (jwt.get_unverified_claims(token)["exp"] - __import__("time").time()) / 60


def test_login_goes_through_planner_and_remember_extends_token(client):
    short = login(client)
    assert short.status_code == 200 and exp_minutes(short.json()["access_token"]) < 61
    assert exp_minutes(login(client, True).json()["access_token"]) > 60 * 24 * 29
    client.state["result"] = "forbidden"
    assert login(client).status_code == 403
    client.state["result"] = "invalid"
    assert login(client).status_code == 401


class Authenticator:
    """Autenticador WebAuthn mínimo (ES256, attestation none)."""

    def __init__(self):
        self.key = ec.generate_private_key(ec.SECP256R1())
        self.cred_id = os.urandom(16)
        self.counter = 0

    def _auth_data(self, rp_id, attested=False):
        flags = 0x01 | 0x04 | (0x40 if attested else 0)
        data = hashlib.sha256(rp_id.encode()).digest() + bytes([flags]) + struct.pack(">I", self.counter)
        if attested:
            n = self.key.public_key().public_numbers()
            cose = cbor2.dumps({1: 2, 3: -7, -1: 1, -2: n.x.to_bytes(32, "big"), -3: n.y.to_bytes(32, "big")})
            data += b"\0" * 16 + struct.pack(">H", len(self.cred_id)) + self.cred_id + cose
        return data

    def create(self, options):
        cd = json.dumps({"type": "webauthn.create", "challenge": options["challenge"], "origin": "https://cms.test"}).encode()
        att = cbor2.dumps({"fmt": "none", "attStmt": {}, "authData": self._auth_data(options["rp"]["id"], True)})
        return {"id": b64(self.cred_id), "rawId": b64(self.cred_id), "type": "public-key",
                "response": {"clientDataJSON": b64(cd), "attestationObject": b64(att)}, "clientExtensionResults": {}}

    def get(self, options):
        self.counter += 1
        cd = json.dumps({"type": "webauthn.get", "challenge": options["challenge"], "origin": "https://cms.test"}).encode()
        ad = self._auth_data(options["rpId"])
        sig = self.key.sign(ad + hashlib.sha256(cd).digest(), ec.ECDSA(hashes.SHA256()))
        return {"id": b64(self.cred_id), "rawId": b64(self.cred_id), "type": "public-key",
                "response": {"clientDataJSON": b64(cd), "authenticatorData": b64(ad), "signature": b64(sig)}, "clientExtensionResults": {}}


def test_passkey_register_login_and_access_check(client):
    bearer = {"Authorization": f"Bearer {login(client).json()['access_token']}", **ORIGIN}
    auth = Authenticator()

    reg = client.post("/api/v1/auth/passkeys/options", headers=bearer).json()
    created = client.post("/api/v1/auth/passkeys", headers=bearer, json={"token": reg["token"], "name": "Mac", "credential": auth.create(reg["options"])})
    assert created.status_code == 201, created.text
    assert [p["name"] for p in client.get("/api/v1/auth/passkeys", headers=bearer).json()] == ["Mac"]

    opts = client.post("/api/v1/auth/passkey/login-options", headers=ORIGIN).json()
    ok = client.post("/api/v1/auth/passkey/login", headers=ORIGIN, json={"token": opts["token"], "credential": auth.get(opts["options"]), "remember": True})
    assert ok.status_code == 200, ok.text
    assert exp_minutes(ok.json()["access_token"]) > 60 * 24 * 29

    client.state["allowed"] = False  # el Planner revocó el acceso
    opts = client.post("/api/v1/auth/passkey/login-options", headers=ORIGIN).json()
    assert client.post("/api/v1/auth/passkey/login", headers=ORIGIN, json={"token": opts["token"], "credential": auth.get(opts["options"])}).status_code == 403

    assert client.post("/api/v1/auth/passkey/login-options", headers={"Origin": "https://evil.test"}).status_code == 403
