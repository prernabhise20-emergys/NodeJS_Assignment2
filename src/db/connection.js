import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const {env:{ DB_PORT, DB_HOST, DB_USER, DB_PASSWORD, DATABASE }} = process;

const connection = mysql.createConnection({
  port: DB_PORT,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DATABASE
});

connection.connect((error) => {
  if (error) {
    console.log(error);
    console.log('error');
  } else {
    console.log('database connected');
  }
});

export default connection;
