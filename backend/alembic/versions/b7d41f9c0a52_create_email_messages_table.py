"""create email messages table

Revision ID: b7d41f9c0a52
Revises: 55079e71d48f
Create Date: 2026-10-09 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7d41f9c0a52'
down_revision: Union[str, Sequence[str], None] = '55079e71d48f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('email_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('direction', sa.String(length=10), nullable=False),
    sa.Column('provider_id', sa.String(length=100), nullable=True),
    sa.Column('message_id', sa.String(length=500), nullable=True),
    sa.Column('from_email', sa.String(length=320), nullable=False),
    sa.Column('to_email', sa.Text(), nullable=False),
    sa.Column('cc', sa.Text(), nullable=True),
    sa.Column('bcc', sa.Text(), nullable=True),
    sa.Column('reply_to', sa.String(length=320), nullable=True),
    sa.Column('subject', sa.String(length=500), nullable=True),
    sa.Column('text_body', sa.Text(), nullable=True),
    sa.Column('html_body', sa.Text(), nullable=True),
    sa.Column('status', sa.String(length=30), nullable=False),
    sa.Column('error_message', sa.Text(), nullable=True),
    sa.Column('is_read', sa.Boolean(), nullable=False, server_default=sa.text('false')),
    sa.Column('has_attachments', sa.Boolean(), nullable=False, server_default=sa.text('false')),
    sa.Column('sent_by_admin_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['sent_by_admin_id'], ['admin_users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_email_messages_id'), 'email_messages', ['id'], unique=False)
    op.create_index(op.f('ix_email_messages_direction'), 'email_messages', ['direction'], unique=False)
    op.create_index(op.f('ix_email_messages_provider_id'), 'email_messages', ['provider_id'], unique=True)
    op.create_index(op.f('ix_email_messages_sent_by_admin_id'), 'email_messages', ['sent_by_admin_id'], unique=False)
    op.create_index('ix_email_messages_created_at', 'email_messages', ['created_at'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index('ix_email_messages_created_at', table_name='email_messages')
    op.drop_index(op.f('ix_email_messages_sent_by_admin_id'), table_name='email_messages')
    op.drop_index(op.f('ix_email_messages_provider_id'), table_name='email_messages')
    op.drop_index(op.f('ix_email_messages_direction'), table_name='email_messages')
    op.drop_index(op.f('ix_email_messages_id'), table_name='email_messages')
    op.drop_table('email_messages')
