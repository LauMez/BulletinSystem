import mysql from 'mysql2';

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'userDB'
};

const connectionString = process.env.DATABASE_URL ?? DEFAULT_CONFIG;

export const {
    SECRET_KEY = 'jhvghuiknbcusikhfbfijuhdfbdbvdcosjcidc-sknfjbcsudc$sk049883gvhrbnsm4'
} = process.env;

export const db = await mysql.createConnection(connectionString);