import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Manual .env parsing to avoid variable expansion issues ---
let databaseUrl = '';
try {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split(/\r?\n/);

  for (const line of envLines) {
    if (line.trim().startsWith('#') || !line.trim()) {
      continue;
    }
    
    const match = line.match(/^\s*([^=]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      
      if (!process.env[key]) {
        process.env[key] = value;
      }

      if (key === 'DATABASE_URL') {
        databaseUrl = value;
      }
    }
  }
} catch (error) {
  console.error('❌ Erro ao ler o arquivo .env. Certifique-se que ele existe na pasta /server.', error);
  process.exit(1);
}
// --- End manual parsing ---


if (!databaseUrl || databaseUrl.trim() === '') {
  console.error('❌ DATABASE_URL não encontrada ou está vazia no arquivo .env');
  process.exit(1);
}

let poolConfig;
const match = databaseUrl.match(/postgresql?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

if (!match) {
  console.error('❌ Formato da DATABASE_URL inválido. Verifique o .env. A URL recebida foi:', `"${databaseUrl}"`);
  console.error('Formato esperado: postgresql://user:password@host:port/database');
  process.exit(1);
}

const [, user, password, host, port, database] = match;

poolConfig = {
  user,
  password,
  host,
  port: parseInt(port, 10),
  database,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
};

console.log('🔗 Configuração de conexão do banco de dados criada com sucesso.');
console.log('📋 Host:', poolConfig.host);

const { Pool } = pg;
const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Conectado ao banco de dados');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com o banco:', err);
});

export default pool;

