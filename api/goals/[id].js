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

  const { id } = req.query;
  const pool = getPool();

  // Atualizar meta
  if (req.method === 'PUT') {
    try {
      const { name, target, saved } = req.body;

      // Verificar se a meta pertence ao usuário
      const check = await pool.query('SELECT id FROM goals WHERE id = $1 AND user_id = $2', [id, authResult.user.userId]);
      if (check.rows.length === 0) {
        return res.status(404).json({ error: 'Meta não encontrada' });
      }

      const result = await pool.query(
        `UPDATE goals 
         SET name = $1, target = $2, saved = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 AND user_id = $5
         RETURNING id, name, target, saved`,
        [name, target, saved || 0, id, authResult.user.userId]
      );

      return res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      return res.status(500).json({ error: 'Erro ao atualizar meta' });
    }
  }

  // Deletar meta
  if (req.method === 'DELETE') {
    try {
      const result = await pool.query(
        'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, authResult.user.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Meta não encontrada' });
      }

      return res.json({ message: 'Meta deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      return res.status(500).json({ error: 'Erro ao deletar meta' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

