// Arquivo para inicializar o banco de dados na primeira execução
// Pode ser chamado manualmente ou automaticamente
import { initDatabase, getPool } from './db.js';

export default async function handler(req, res) {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Primeiro, testar a conexão
    const pool = getPool();
    const testResult = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    // Depois, inicializar as tabelas
    await initDatabase();
    
    return res.json({ 
      success: true, 
      message: 'Banco de dados inicializado com sucesso',
      connection: {
        status: 'connected',
        currentTime: testResult.rows[0].current_time,
        postgresVersion: testResult.rows[0].pg_version.substring(0, 50) + '...'
      }
    });
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro ao inicializar banco de dados',
      message: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

