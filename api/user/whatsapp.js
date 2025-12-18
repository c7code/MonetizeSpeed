import { getPool } from '../db.js';
import { authenticateToken } from '../auth.js';

export default async function handler(req, res) {
  // Suportar CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const authResult = authenticateToken(req);
  
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  try {
    const { whatsapp_number } = req.body;
    
    if (!whatsapp_number) {
      return res.status(400).json({ error: 'Número do WhatsApp é obrigatório' });
    }
    
    // Validar formato básico (apenas números, pode ter + no início)
    const cleanNumber = whatsapp_number.replace(/[^\d+]/g, '');
    if (cleanNumber.length < 10) {
      return res.status(400).json({ error: 'Número inválido' });
    }
    
    const pool = getPool();
    const result = await pool.query(
      'UPDATE users SET whatsapp_number = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, whatsapp_number',
      [cleanNumber, authResult.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    return res.json({
      message: 'Número do WhatsApp atualizado com sucesso',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao atualizar WhatsApp:', error);
    return res.status(500).json({ error: 'Erro ao atualizar número do WhatsApp' });
  }
}

