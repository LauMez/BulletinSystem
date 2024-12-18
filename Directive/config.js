import mysql from 'mysql2';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'directiveDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

export const db = mysql.createConnection(connectionString);