import pg from 'pg';

const { Pool } = pg;

// Pool de conexão otimizado para serverless (conexões efêmeras)
let pool = null;

export function getPool() {
  if (!pool) {
    // No Vercel, as variáveis de ambiente já estão disponíveis
    if (!process.env.DATABASE_URL) {
      const error = new Error('DATABASE_URL não configurada');
      console.error('❌ Erro:', error.message);
      console.error('📋 Variáveis de ambiente disponíveis:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('JWT')));
      throw error;
    }

    try {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        },
        // Configurações otimizadas para serverless
        max: 1, // Apenas 1 conexão por função (serverless)
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000,
      });

      pool.on('error', (err) => {
        console.error('❌ Erro na conexão com o banco:', err);
        pool = null; // Resetar pool em caso de erro
      });

      console.log('✅ Pool de conexão criado');
    } catch (error) {
      console.error('❌ Erro ao criar pool:', error);
      throw error;
    }
  }

  return pool;
}

// Função para inicializar tabelas (pode ser chamada uma vez)
export async function initDatabase() {
  const pool = getPool();
  
  try {
    // Tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        whatsapp_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Adicionar coluna whatsapp_number se não existir
    await pool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='users' AND column_name='whatsapp_number'
        ) THEN
          ALTER TABLE users ADD COLUMN whatsapp_number VARCHAR(20);
        END IF;
      END $$;
    `);

    // Tabela de transações
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        description TEXT,
        recurring BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'paid' CHECK (status IN ('paid', 'received', 'pending_payment', 'pending_receipt')),
        receipt_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de orçamentos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        limit_amount DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, category)
      )
    `);

    // Tabela de metas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        target DECIMAL(10, 2) NOT NULL,
        saved DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabelas criadas/verificadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
}

export default getPool;

