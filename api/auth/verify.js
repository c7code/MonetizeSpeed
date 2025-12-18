import { getPool } from '../db.js';
import { authenticateToken } from '../auth.js';

export default async function handler(req, res) {
  // Suportar CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const authResult = authenticateToken(req);
    
    if (authResult.error) {
      return res.status(authResult.status).json({ error: authResult.error });
    }

    const pool = getPool();
    const result = await pool.query(
      'SELECT id, email, name FROM users WHERE id = $1',
      [authResult.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json({
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(500).json({ error: 'Erro ao verificar token' });
  }
}

