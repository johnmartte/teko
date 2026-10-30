"""create admin passkeys

Revision ID: a7c3e9d1b254
Revises: f2a6c1d8b9e0
Create Date: 2026-10-30 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a7c3e9d1b254'
down_revision: Union[str, Sequence[str], None] = 'f2a6c1d8b9e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'admin_passkeys',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('admin_user_id', sa.Integer(), sa.ForeignKey('admin_users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.String(length=80), nullable=False),
        sa.Column('credential_id', sa.String(length=512), nullable=False),
        sa.Column('public_key', sa.Text(), nullable=False),
        sa.Column('sign_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('last_used_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_admin_passkeys_admin_user_id', 'admin_passkeys', ['admin_user_id'])
    op.create_index('ix_admin_passkeys_credential_id', 'admin_passkeys', ['credential_id'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_admin_passkeys_credential_id', table_name='admin_passkeys')
    op.drop_index('ix_admin_passkeys_admin_user_id', table_name='admin_passkeys')
    op.drop_table('admin_passkeys')
