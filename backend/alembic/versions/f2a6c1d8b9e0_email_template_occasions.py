"""email template occasions and signature styles

Revision ID: f2a6c1d8b9e0
Revises: e4b7a2c9d351
Create Date: 2026-10-09 22:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f2a6c1d8b9e0'
down_revision: Union[str, Sequence[str], None] = 'e4b7a2c9d351'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


FOOTER = (
    "Software que transforma negocios. Diseñamos, desarrollamos e implementamos soluciones digitales a medida.\n"
    "Recibes este correo por tu relación de servicio con TEKO."
)
LINKS = [
    {"label": "Servicios", "url": "https://teko.do/servicios"},
    {"label": "Portafolio", "url": "https://teko.do/portafolio"},
    {"label": "Instagram", "url": "https://www.instagram.com/teko.dr/"},
]
SIGNATURE = "Equipo TEKO\nSanto Domingo, República Dominicana"
CARD = {
    "name": "Equipo TEKO",
    "title": "Software que transforma negocios",
    "phone": None,
    "email": "ayuda-cliente@teko.do",
    "website": "https://teko.do",
    "address": "Santo Domingo, República Dominicana",
    "tagline": "Software que *transforma*",
}


def _occasion(name, occasion, kicker, headline, button_label=None, button_url=None,
              signature_style="texto", footer=FOOTER):
    return {
        "name": name,
        "is_default": False,
        "logo_url": "https://teko.do/email/teko-logo-white.png",
        "header_background": "#0a0e1a",
        "accent_color": "#0047ff",
        "occasion": occasion,
        "kicker": kicker,
        "headline": headline,
        "button_label": button_label,
        "button_url": button_url,
        "signature": SIGNATURE,
        "signature_style": signature_style,
        "signature_card": CARD,
        "footer_text": footer,
        "social_links": LINKS,
    }


OCCASIONS = [
    _occasion("Bienvenida", "Bienvenida", "Nuevo cliente", "Hoy empieza la *transformación* de tu negocio.",
              "Conoce al equipo", "https://teko.do/nosotros"),
    _occasion("Propuesta comercial", "Propuesta comercial", "Propuesta", "Tu propuesta está *lista*.",
              "Agendar una llamada", "https://teko.do/contacto", signature_style="completa"),
    _occasion("Reunión confirmada", "Reunión confirmada", "Sesión de descubrimiento", "Nos vemos *pronto*.",
              signature_style="compacta"),
    _occasion("Factura", "Factura", "Facturación", "Tu factura está *disponible*."),
    _occasion("Proyecto entregado", "Lanzamiento", "Proyecto entregado", "Tu proyecto ya está *en línea*.",
              "Ver nuestro portafolio", "https://teko.do/portafolio"),
    _occasion("Novedades", "Novedades", "Lo nuevo en TEKO", "Lo que estamos *construyendo* este mes.",
              "Agenda una llamada", "https://teko.do/contacto", signature_style="oscura",
              footer="Software que transforma negocios. Diseñamos, desarrollamos e implementamos soluciones digitales a medida.\n"
                     "Recibes este correo porque te suscribiste a las novedades de TEKO."),
]


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('email_templates', sa.Column('occasion', sa.String(length=40), nullable=True))
    op.add_column('email_templates', sa.Column('kicker', sa.String(length=80), nullable=True))
    op.add_column('email_templates', sa.Column('headline', sa.String(length=160), nullable=True))
    op.add_column('email_templates', sa.Column('button_label', sa.String(length=40), nullable=True))
    op.add_column('email_templates', sa.Column('button_url', sa.String(length=500), nullable=True))
    op.add_column('email_templates', sa.Column('signature_style', sa.String(length=12), nullable=False, server_default='texto'))
    op.add_column('email_templates', sa.Column('signature_card', sa.JSON(), nullable=True))

    templates = sa.table(
        'email_templates',
        sa.column('name', sa.String), sa.column('is_default', sa.Boolean),
        sa.column('logo_url', sa.String), sa.column('header_background', sa.String), sa.column('accent_color', sa.String),
        sa.column('occasion', sa.String), sa.column('kicker', sa.String), sa.column('headline', sa.String),
        sa.column('button_label', sa.String), sa.column('button_url', sa.String),
        sa.column('signature', sa.Text), sa.column('signature_style', sa.String), sa.column('signature_card', sa.JSON),
        sa.column('footer_text', sa.Text), sa.column('social_links', sa.JSON),
    )
    op.bulk_insert(templates, OCCASIONS)


def downgrade() -> None:
    """Downgrade schema."""
    names = [item["name"] for item in OCCASIONS]
    op.execute(
        sa.text("DELETE FROM email_templates WHERE occasion IS NOT NULL AND name IN :names")
        .bindparams(sa.bindparam("names", expanding=True, value=names))
    )
    for column in ('signature_card', 'signature_style', 'button_url', 'button_label', 'headline', 'kicker', 'occasion'):
        op.drop_column('email_templates', column)
