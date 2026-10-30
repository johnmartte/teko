import { useSyncExternalStore } from "react";
import { api, finishLogin, type AdminUser } from "@/lib/admin-api";

// WebAuthn habla base64url en el servidor y ArrayBuffer en el navegador.
const toBuf = (s: string): ArrayBuffer => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0)).buffer;
};
const toB64 = (b: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

interface Descriptor { id: string; type: "public-key"; transports?: AuthenticatorTransport[] }
const descriptors = (list?: Descriptor[]) => (list ?? []).map((c) => ({ ...c, id: toBuf(c.id) }));

interface WebauthnOptions {
  challenge: string;
  user: { id: string };
  excludeCredentials?: Descriptor[];
  allowCredentials?: Descriptor[];
  [key: string]: unknown;
}

export interface Passkey { id: number; name: string; last_used_at: string | null; created_at: string }

// useSyncExternalStore evita el desajuste de hidratación (SSR no conoce `window`).
export function usePasskeysSupported(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => typeof window !== "undefined" && !!window.PublicKeyCredential && !!navigator.credentials,
    () => false,
  );
}

// El usuario cerró el diálogo del sistema: no es un error que mostrar.
export const isCancelled = (e: unknown): boolean =>
  e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "AbortError");

export const listPasskeys = () => api<Passkey[]>("/auth/passkeys");
export const deletePasskey = (id: number) => api<void>(`/auth/passkeys/${id}`, { method: "DELETE" });

export async function registerPasskey(name: string): Promise<void> {
  const { token, options: o } = await api<{ token: string; options: WebauthnOptions }>("/auth/passkeys/options", { method: "POST" });
  const cred = (await navigator.credentials.create({
    publicKey: {
      ...o,
      challenge: toBuf(o.challenge),
      user: { ...o.user, id: toBuf(o.user.id) },
      excludeCredentials: descriptors(o.excludeCredentials),
    } as PublicKeyCredentialCreationOptions,
  })) as PublicKeyCredential | null;
  if (!cred) throw new Error("No se creó el passkey.");
  const r = cred.response as AuthenticatorAttestationResponse;
  await api("/auth/passkeys", {
    method: "POST",
    body: JSON.stringify({
      token,
      name,
      credential: {
        id: cred.id,
        rawId: toB64(cred.rawId),
        type: cred.type,
        response: { clientDataJSON: toB64(r.clientDataJSON), attestationObject: toB64(r.attestationObject), transports: r.getTransports?.() ?? [] },
        clientExtensionResults: cred.getClientExtensionResults(),
      },
    }),
  });
}

export async function loginWithPasskeyCeremony(remember: boolean): Promise<AdminUser> {
  const { token, options: o } = await api<{ token: string; options: WebauthnOptions }>("/auth/passkey/login-options", { method: "POST" });
  const cred = (await navigator.credentials.get({
    publicKey: { ...o, challenge: toBuf(o.challenge), allowCredentials: descriptors(o.allowCredentials) } as PublicKeyCredentialRequestOptions,
  })) as PublicKeyCredential | null;
  if (!cred) throw new Error("No se obtuvo el passkey.");
  const r = cred.response as AuthenticatorAssertionResponse;
  const result = await api<{ access_token: string }>("/auth/passkey/login", {
    method: "POST",
    body: JSON.stringify({
      token,
      remember,
      credential: {
        id: cred.id,
        rawId: toB64(cred.rawId),
        type: cred.type,
        response: {
          clientDataJSON: toB64(r.clientDataJSON),
          authenticatorData: toB64(r.authenticatorData),
          signature: toB64(r.signature),
          ...(r.userHandle ? { userHandle: toB64(r.userHandle) } : {}),
        },
        clientExtensionResults: cred.getClientExtensionResults(),
      },
    }),
  });
  return finishLogin(result.access_token, remember);
}
