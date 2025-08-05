import { Pool } from 'pg';

let pool;

function createPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });

    pool.on('error', (err) => {
      console.error('PostgreSQL pool error:', err);
    });
  }
  return pool;
}

const database = {
  query: async (text, params) => {
    const client = createPool();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },
  
  getClient: async () => {
    const client = createPool();
    return await client.connect();
  },

  end: async () => {
    if (pool) {
      await pool.end();
      pool = null;
    }
  }
};

export default database;