// Endpoint de teste para verificar o formato do req/res
export default async function handler(req, res) {
  try {
    // Log detalhado do objeto req
    const reqInfo = {
      method: req?.method,
      url: req?.url,
      headers: req?.headers ? Object.keys(req?.headers) : null,
      bodyType: typeof req?.body,
      bodyIsObject: typeof req?.body === 'object' && req?.body !== null,
      query: req?.query,
      hasQuery: !!req?.query,
    };

    return res.status(200).json({
      message: 'Teste de formato req/res',
      reqInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro no teste',
      message: error.message,
      stack: error.stack
    });
  }
}

