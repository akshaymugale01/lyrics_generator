import { configDotenv } from "dotenv";
import sql from "mssql";

configDotenv();

export const dbConfig = {
    user: process.env.DB_USER || 'ADSMN/akshay_mugale',
    password: process.env.DB_PASSWORD || 'root',
    server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
    database: process.env.DB_NAME || 'song_generator',
    options: {  
        encrypt: false,
        trustServerCertificate: true,
    }
};

export async function connectDB() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log("Connected to the database");
        return pool;    
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

