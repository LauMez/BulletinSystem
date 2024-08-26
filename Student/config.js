import mysql from 'mysql2';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'studentDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

export const db = await mysql.createConnection(connectionString);