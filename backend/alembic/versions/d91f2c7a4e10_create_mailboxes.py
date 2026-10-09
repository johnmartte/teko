"""create mailboxes for planner employees

Revision ID: d91f2c7a4e10
Revises: c3a8e5f21d07
Create Date: 2026-10-09 18:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd91f2c7a4e10'
down_revision: Union[str, Sequence[str], None] = 'c3a8e5f21d07'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('mailboxes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('address', sa.String(length=320), nullable=False),
    sa.Column('display_name', sa.String(length=150), nullable=False),
    sa.Column('signature', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
    sa.Column('planner_user_id', sa.String(length=64), nullable=False),
    sa.Column('planner_user_name', sa.String(length=200), nullable=False),
    sa.Column('planner_user_email', sa.String(length=320), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_mailboxes_id'), 'mailboxes', ['id'], unique=False)
    op.create_index(op.f('ix_mailboxes_address'), 'mailboxes', ['address'], unique=True)
    op.create_index(op.f('ix_mailboxes_planner_user_id'), 'mailboxes', ['planner_user_id'], unique=True)

    op.create_table('mailbox_messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('mailbox_id', sa.Integer(), nullable=False),
    sa.Column('email_message_id', sa.Integer(), nullable=False),
    sa.Column('is_read', sa.Boolean(), nullable=False, server_default=sa.text('false')),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['mailbox_id'], ['mailboxes.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['email_message_id'], ['email_messages.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('mailbox_id', 'email_message_id', name='uq_mailbox_message')
    )
    op.create_index(op.f('ix_mailbox_messages_id'), 'mailbox_messages', ['id'], unique=False)
    op.create_index(op.f('ix_mailbox_messages_mailbox_id'), 'mailbox_messages', ['mailbox_id'], unique=False)
    op.create_index(op.f('ix_mailbox_messages_email_message_id'), 'mailbox_messages', ['email_message_id'], unique=False)

    op.add_column('email_messages', sa.Column('is_general', sa.Boolean(), nullable=False, server_default=sa.text('true')))
    op.create_index(op.f('ix_email_messages_is_general'), 'email_messages', ['is_general'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_email_messages_is_general'), table_name='email_messages')
    op.drop_column('email_messages', 'is_general')
    op.drop_index(op.f('ix_mailbox_messages_email_message_id'), table_name='mailbox_messages')
    op.drop_index(op.f('ix_mailbox_messages_mailbox_id'), table_name='mailbox_messages')
    op.drop_index(op.f('ix_mailbox_messages_id'), table_name='mailbox_messages')
    op.drop_table('mailbox_messages')
    op.drop_index(op.f('ix_mailboxes_planner_user_id'), table_name='mailboxes')
    op.drop_index(op.f('ix_mailboxes_address'), table_name='mailboxes')
    op.drop_index(op.f('ix_mailboxes_id'), table_name='mailboxes')
    op.drop_table('mailboxes')
