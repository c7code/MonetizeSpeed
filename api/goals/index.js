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

  // Listar metas do usuário
  if (req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT id, name, target, saved FROM goals WHERE user_id = $1 ORDER BY created_at DESC',
        [authResult.user.userId]
      );
      return res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      return res.status(500).json({ error: 'Erro ao buscar metas' });
    }
  }

  // Criar meta
  if (req.method === 'POST') {
    try {
      const { name, target, saved } = req.body;
      
      if (!name || !target) {
        return res.status(400).json({ error: 'Campos obrigatórios: name, target' });
      }

      const result = await pool.query(
        'INSERT INTO goals (user_id, name, target, saved) VALUES ($1, $2, $3, $4) RETURNING id, name, target, saved',
        [authResult.user.userId, name, target, saved || 0]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      return res.status(500).json({ error: 'Erro ao criar meta' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}

