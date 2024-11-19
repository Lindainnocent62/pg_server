import mysql from 'mysql2/promise'; //it will allows to connect to the database to make operations
import dotenv from 'dotenv'; //we'll store our credentials to connect to the database
import { Sequelize } from 'sequelize';

dotenv.config();

const DB_NAME=process.env.DB_NAME || '';
const DB_USER=process.env.DB_USER || '';
const  DB_PASS=process.env.DB_PASSWORD || '';
const DB_HOST=process.env.DB_HOST || '';

export const db_Pool = mysql.createPool({ //connection to the database and the pool connection will optimise the operations
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,

})

//creating a connection to the db using sequelize
 const sequelize = new Sequelize(DB_NAME, DB_USER , DB_PASS , {
        host: DB_HOST,
        dialect: 'mysql',
        logging: false,
})

const testConnection = async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection to the database has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    };
    
    testConnection();

export default sequelize;
