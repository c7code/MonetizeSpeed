export default async function handler(req, res) {
  // Suportar CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  return res.json({ 
    status: 'ok', 
    message: 'MonetizeSpeed API está funcionando',
    timestamp: new Date().toISOString()
  });
}

