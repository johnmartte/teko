"""create email templates table

Revision ID: c3a8e5f21d07
Revises: b7d41f9c0a52
Create Date: 2026-10-09 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3a8e5f21d07'
down_revision: Union[str, Sequence[str], None] = 'b7d41f9c0a52'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    templates = op.create_table('email_templates',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('is_default', sa.Boolean(), nullable=False, server_default=sa.text('false')),
    sa.Column('logo_url', sa.String(length=500), nullable=True),
    sa.Column('header_background', sa.String(length=7), nullable=False, server_default='#080a0f'),
    sa.Column('accent_color', sa.String(length=7), nullable=False, server_default='#1ec4ff'),
    sa.Column('signature', sa.Text(), nullable=True),
    sa.Column('footer_text', sa.Text(), nullable=True),
    sa.Column('social_links', sa.JSON(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_email_templates_id'), 'email_templates', ['id'], unique=False)

    op.bulk_insert(templates, [
        {
            "name": "TEKO",
            "is_default": True,
            "logo_url": "https://teko.do/LogoTeko.png",
            "header_background": "#080a0f",
            "accent_color": "#1ec4ff",
            "signature": "Un saludo,\nEl equipo de TEKO",
            "footer_text": "TEKO · Software que transforma negocios · US + LATAM",
            "social_links": [
                {"label": "Instagram", "url": "https://www.instagram.com/teko.dr/"},
                {"label": "teko.do", "url": "https://teko.do"},
            ],
        },
    ])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_email_templates_id'), table_name='email_templates')
    op.drop_table('email_templates')
