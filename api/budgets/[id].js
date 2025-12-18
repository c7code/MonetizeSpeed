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

  // Atualizar orçamento
  if (req.method === 'PUT') {
    try {
      const { category, limit } = req.body;

      // Verificar se o orçamento pertence ao usuário
      const check = await pool.query('SELECT id FROM budgets WHERE id = $1 AND user_id = $2', [id, authResult.user.userId]);
      if (check.rows.length === 0) {
        return res.status(404).json({ error: 'Orçamento não encontrado' });
      }

      const result = await pool.query(
        `UPDATE budgets 
         SET category = $1, limit_amount = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3 AND user_id = $4
         RETURNING id, category, limit_amount as limit`,
        [category, limit, id, authResult.user.userId]
      );

      return res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      return res.status(500).json({ error: 'Erro ao atualizar orçamento' });
    }
  }

  // Deletar orçamento
  if (req.method === 'DELETE') {
    try {
      const result = await pool.query(
        'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, authResult.user.userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Orçamento não encontrado' });
      }

      return res.json({ message: 'Orçamento deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar orçamento:', error);
      return res.status(500).json({ error: 'Erro ao deletar orçamento' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

