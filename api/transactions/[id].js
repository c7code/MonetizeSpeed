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

  // Extrair ID da query (no Vercel, rotas dinâmicas vêm em req.query)
  const id = req.query?.id;
  
  if (!id) {
    return res.status(400).json({ error: 'ID não fornecido' });
  }
  const pool = getPool();

  // Atualizar transação
  if (req.method === 'PUT') {
    try {
      const { type, category, amount, date, description, recurring, status, receipt_url } = req.body;

      // Verificar se a transação pertence ao usuário
      const check = await pool.query('SELECT id FROM transactions WHERE id = $1 AND user_id = $2', [id, authResult.user.userId]);
      if (check.rows.length === 0) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      const result = await pool.query(
        `UPDATE transactions 
         SET type = $1, category = $2, amount = $3, date = $4, description = $5, recurring = $6, status = $7, receipt_url = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9 AND user_id = $10
         RETURNING *`,
        [type, category, amount, date, description || null, recurring || false, status, receipt_url || null, id, authResult.user.userId]
      );

      return res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      return res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
  }

  // Deletar transação
  if (req.method === 'DELETE') {
    try {
      const result = await pool.query(
        'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, authResult.user.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }

      return res.json({ message: 'Transação deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      return res.status(500).json({ error: 'Erro ao deletar transação' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

