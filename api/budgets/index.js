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

  // Listar orçamentos do usuário
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT id, category, limit_amount as limit FROM budgets WHERE user_id = $1 ORDER BY category',
        [authResult.user.userId]
      );
      return res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
      return res.status(500).json({ error: 'Erro ao buscar orçamentos' });
    }
  }

  // Criar orçamento
  if (req.method === 'POST') {
    try {
      const { category, limit } = req.body;
      
      if (!category || !limit) {
        return res.status(400).json({ error: 'Campos obrigatórios: category, limit' });
      }

      // Verificar se já existe orçamento para essa categoria
      const existing = await pool.query(
        'SELECT id FROM budgets WHERE user_id = $1 AND category = $2',
        [authResult.user.userId, category]
      );

      let result;
      if (existing.rows.length > 0) {
        // Atualizar existente
        result = await pool.query(
          'UPDATE budgets SET limit_amount = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING id, category, limit_amount as limit',
          [limit, existing.rows[0].id, authResult.user.userId]
        );
      } else {
        // Criar novo
        result = await pool.query(
          'INSERT INTO budgets (user_id, category, limit_amount) VALUES ($1, $2, $3) RETURNING id, category, limit_amount as limit',
          [authResult.user.userId, category, limit]
        );
      }

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar/atualizar orçamento:', error);
      return res.status(500).json({ error: 'Erro ao salvar orçamento' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

