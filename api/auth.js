import jwt from 'jsonwebtoken';

export function authenticateToken(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return { error: 'Token não fornecido', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded };
  } catch (err) {
    return { error: 'Token inválido ou expirado', status: 403 };
  }
}

export function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify(body),
  };
}

