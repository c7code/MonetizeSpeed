// Configuração centralizada da URL da API
// Em produção, use a variável de ambiente VITE_API_URL
// Exemplo: VITE_API_URL=https://sua-api.com/api

const getApiUrl = () => {
  // Prioridade 1: Variável de ambiente explícita
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // Prioridade 2: Detecção de produção
  // Verifica se está rodando em produção (modo build do Vite)
  if (import.meta.env.PROD) {
    // Em produção, se não houver variável de ambiente, usa URL relativa
    // Isso assume que há um proxy configurado ou que a API está no mesmo domínio
    return '/api'
  }

  // Prioridade 3: Desenvolvimento local
  return 'http://localhost:3000/api'
}

export const API_URL = getApiUrl()

// Log apenas em desenvolvimento para debug
if (!import.meta.env.PROD) {
  console.log('API URL configurada:', API_URL)
}

