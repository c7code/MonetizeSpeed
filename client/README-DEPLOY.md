# Configuração de Deploy

## Variáveis de Ambiente na Vercel

Para que a aplicação funcione corretamente em produção, você precisa configurar a variável de ambiente `VITE_API_URL` no painel da Vercel:

1. Acesse o projeto na Vercel
2. Vá em **Settings** > **Environment Variables**
3. Adicione a variável:
   - **Name**: `VITE_API_URL`
   - **Value**: URL completa da sua API backend (ex: `https://sua-api-backend.vercel.app/api`)
   - **Environment**: Production (e Preview se necessário)

## Exemplo

Se sua API backend está em `https://monetize-speed-api.vercel.app`, configure:

```
VITE_API_URL=https://monetize-speed-api.vercel.app/api
```

## Verificação

Após configurar a variável de ambiente:
1. Faça um novo deploy na Vercel
2. A variável será injetada durante o build
3. A aplicação usará a URL correta da API em produção

## Desenvolvimento Local

Para desenvolvimento local, a aplicação usa automaticamente `http://localhost:3000/api`. Você pode sobrescrever criando um arquivo `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
```

