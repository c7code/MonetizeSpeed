// Arquivo para testar a conexão com o banco de dados
import { getPool } from './db.js';

export default async function handler(req, res) {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const pool = getPool();
    
    // Testar conexão básica
    const timeResult = await pool.query('SELECT NOW() as current_time');
    
    // Verificar se as tabelas existem
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'transactions', 'budgets', 'goals')
      ORDER BY table_name
    `);
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    const requiredTables = ['users', 'transactions', 'budgets', 'goals'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    return res.json({
      success: true,
      connection: {
        status: 'connected',
        currentTime: timeResult.rows[0].current_time
      },
      tables: {
        existing: existingTables,
        missing: missingTables,
        allPresent: missingTables.length === 0
      },
      recommendation: missingTables.length > 0 
        ? 'Execute /api/_init-db para criar as tabelas faltantes'
        : 'Banco de dados está pronto para uso'
    });
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Erro ao conectar com o banco de dados',
      message: error.message,
      code: error.code,
      hint: error.code === 'ENOTFOUND' 
        ? 'Verifique se o host do banco está correto'
        : error.code === 'ECONNREFUSED'
        ? 'Verifique se o banco está acessível e se a porta está correta'
        : 'Verifique a DATABASE_URL nas variáveis de ambiente'
    });
  }
}

