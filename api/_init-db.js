// Arquivo para inicializar o banco de dados na primeira execução
// Pode ser chamado manualmente ou automaticamente
import { initDatabase } from './db.js';

export default async function handler(req, res) {
  try {
    await initDatabase();
    return res.json({ 
      success: true, 
      message: 'Banco de dados inicializado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    return res.status(500).json({ 
      error: 'Erro ao inicializar banco de dados',
      message: error.message 
    });
  }
}

