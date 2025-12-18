import { getPool } from '../db.js';
import { authenticateToken } from '../auth.js';

export default async function handler(req, res) {
  // Suportar CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authResult = authenticateToken(req);
  
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const pool = getPool();

  // Listar transações do usuário
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
        [authResult.user.userId]
      );
      return res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return res.status(500).json({ error: 'Erro ao buscar transações' });
    }
  }

  // Criar transação
  if (req.method === 'POST') {
    try {
      const { type, category, amount, date, description, recurring, status, receipt_url } = req.body;
      
      if (!type || !category || !amount || !date) {
        return res.status(400).json({ error: 'Campos obrigatórios: type, category, amount, date' });
      }

      const result = await pool.query(
        `INSERT INTO transactions (user_id, type, category, amount, date, description, recurring, status, receipt_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [authResult.user.userId, type, category, amount, date, description || null, recurring || false, status || (type === 'expense' ? 'paid' : 'received'), receipt_url || null]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      return res.status(500).json({ error: 'Erro ao criar transação' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

