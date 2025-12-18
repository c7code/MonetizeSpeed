// Processar mensagem e extrair informações da transação
function parseTransactionMessage(message) {
  const text = message.toLowerCase().trim();
  
  // Padrões para identificar tipo de transação
  const expenseKeywords = ['gastei', 'paguei', 'comprei', 'despesa', 'gasto', 'pago'];
  const incomeKeywords = ['recebi', 'ganhei', 'entrou', 'receita', 'recebido'];
  
  const isExpense = expenseKeywords.some(keyword => text.includes(keyword));
  const isIncome = incomeKeywords.some(keyword => text.includes(keyword));
  
  const type = isExpense ? 'expense' : isIncome ? 'income' : 'expense'; // default é despesa
  
  // Extrair valor (procura por números com "reais", "r$", ou apenas números)
  const valuePatterns = [
    /(\d+[\.,]?\d*)\s*(?:reais?|r\$|rs)/gi,
    /r\$\s*(\d+[\.,]?\d*)/gi,
    /(\d+[\.,]?\d*)/g
  ];
  
  let amount = null;
  for (const pattern of valuePatterns) {
    const match = text.match(pattern);
    if (match) {
      // Pegar o primeiro número encontrado
      const valueStr = match[0].replace(/[^\d,.]/g, '').replace(',', '.');
      amount = parseFloat(valueStr);
      if (amount && amount > 0) break;
    }
  }
  
  // Extrair categoria (procura por palavras-chave de categorias)
  const categories = [
    'alimentação', 'almoço', 'jantar', 'lanche', 'comida', 'restaurante',
    'transporte', 'uber', 'táxi', 'combustível', 'gasolina', 'ônibus',
    'lazer', 'cinema', 'show', 'festa', 'viagem',
    'saúde', 'médico', 'farmácia', 'hospital',
    'educação', 'curso', 'livro', 'escola',
    'moradia', 'aluguel', 'condomínio', 'luz', 'água', 'internet',
    'compras', 'supermercado', 'mercado',
    'salário', 'freelance', 'venda'
  ];
  
  let category = 'Outros';
  for (const cat of categories) {
    if (text.includes(cat)) {
      // Mapear para categorias padrão
      if (['alimentação', 'almoço', 'jantar', 'lanche', 'comida', 'restaurante'].includes(cat)) {
        category = 'Alimentação';
      } else if (['transporte', 'uber', 'táxi', 'combustível', 'gasolina', 'ônibus'].includes(cat)) {
        category = 'Transporte';
      } else if (['lazer', 'cinema', 'show', 'festa', 'viagem'].includes(cat)) {
        category = 'Lazer';
      } else if (['saúde', 'médico', 'farmácia', 'hospital'].includes(cat)) {
        category = 'Saúde';
      } else if (['educação', 'curso', 'livro', 'escola'].includes(cat)) {
        category = 'Educação';
      } else if (['moradia', 'aluguel', 'condomínio', 'luz', 'água', 'internet'].includes(cat)) {
        category = 'Moradia';
      } else if (['compras', 'supermercado', 'mercado'].includes(cat)) {
        category = 'Compras';
      } else if (['salário', 'freelance', 'venda'].includes(cat)) {
        category = 'Salário';
      }
      break;
    }
  }
  
  // Data padrão é hoje
  const date = new Date().toISOString().split('T')[0];
  
  // Descrição é a mensagem original
  const description = message.trim();
  
  return {
    type,
    amount,
    category,
    date,
    description,
    status: type === 'expense' ? 'paid' : 'received'
  };
}

export default async function handler(req, res) {
  // Suportar CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensagem não fornecida' });
    }
    
    const parsed = parseTransactionMessage(message);
    
    return res.json({
      original: message,
      parsed
    });
  } catch (error) {
    console.error('Erro ao testar parser:', error);
    return res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
}

