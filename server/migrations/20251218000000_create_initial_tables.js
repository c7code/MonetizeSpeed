/* eslint-disable camelcase */

export async function up(pgm) {
  // Tabela de usuários
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    name: { type: 'varchar(255)' },
    whatsapp_number: { type: 'varchar(20)' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Tabela de transações
  pgm.createTable('transactions', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    type: { type: 'varchar(20)', notNull: true, check: "type IN ('income', 'expense')" },
    category: { type: 'varchar(100)', notNull: true },
    amount: { type: 'decimal(10, 2)', notNull: true },
    date: { type: 'date', notNull: true },
    description: { type: 'text' },
    recurring: { type: 'boolean', default: false },
    status: { type: 'varchar(20)', default: 'paid', check: "status IN ('paid', 'received', 'pending_payment', 'pending_receipt')" },
    receipt_url: { type: 'text' },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });

  // Tabela de orçamentos
  pgm.createTable('budgets', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    category: { type: 'varchar(100)', notNull: true },
    limit_amount: { type: 'decimal(10, 2)', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.addConstraint('budgets', 'unique_user_category', {
    unique: ['user_id', 'category'],
  });

  // Tabela de metas
  pgm.createTable('goals', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    name: { type: 'varchar(255)', notNull: true },
    target: { type: 'decimal(10, 2)', notNull: true },
    saved: { type: 'decimal(10, 2)', default: 0 },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });
}

export async function down(pgm) {
  pgm.dropTable('goals');
  pgm.dropTable('budgets');
  pgm.dropTable('transactions');
  pgm.dropTable('users');
}