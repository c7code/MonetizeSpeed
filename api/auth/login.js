import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool, initDatabase } from '../db.js';

export default async function handler(req, res) {
  // Suportar CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Verificar variáveis de ambiente
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL não configurada');
      return res.status(500).json({ error: 'Configuração do servidor inválida' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET não configurada');
      return res.status(500).json({ error: 'Configuração do servidor inválida' });
    }

    // Fazer parse do body se necessário
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Body inválido' });
      }
    }

    const { email, password } = body || {};

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const pool = getPool();

    // Buscar usuário
    let result;
    try {
      result = await pool.query(
        'SELECT id, email, password_hash, name FROM users WHERE email = $1',
        [email.toLowerCase()]
      );
    } catch (dbError) {
      // Se a tabela não existir, tentar criar
      if (dbError.code === '42P01' || dbError.message.includes('does not exist')) {
        console.log('⚠️ Tabela users não existe, tentando inicializar banco...');
        try {
          await initDatabase();
          // Tentar novamente
          result = await pool.query(
            'SELECT id, email, password_hash, name FROM users WHERE email = $1',
            [email.toLowerCase()]
          );
        } catch (initError) {
          console.error('Erro ao inicializar banco:', initError);
          return res.status(500).json({ 
            error: 'Banco de dados não inicializado',
            hint: 'Acesse /api/_init-db para inicializar o banco'
          });
        }
      } else {
        throw dbError;
      }
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    console.error('Stack:', error.stack);
    return res.status(500).json({ 
      error: 'Erro ao fazer login',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

