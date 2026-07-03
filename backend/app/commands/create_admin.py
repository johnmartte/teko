from getpass import getpass

from app.db.session import SessionLocal
from app.models.admin_user import AdminUser
from app.security.hashing import hash_password


def create_admin():
    db = SessionLocal()

    try:
        full_name = input("Nombre completo: ").strip()
        email = input("Email: ").strip().lower()
        password = getpass("Contraseña: ").strip()

        existing_admin = (
            db.query(AdminUser)
            .filter(AdminUser.email == email)
            .first()
        )

        if existing_admin:
            print("Ya existe un administrador con ese email.")
            return

        admin = AdminUser(
            full_name=full_name,
            email=email,
            password_hash=hash_password(password),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("Administrador creado correctamente.")

    finally:
        db.close()


if __name__ == "__main__":
    create_admin()