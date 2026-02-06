import { config } from 'dotenv';
config(); // Load environment variables from .env file

// Server configuration
export const PORT = process.env.PORT || 3500;

// Security configuration (JWT)
export const TOKEN_SECRET = process.env.JWT_SECRET || 'clave_secreta_de_emergencia_2026';
export const TOKEN_EXPIRATION = '2h'; // Centralized here for easy future updates

// Database configuration
// This allows you to use these constants in your db.js file as well
export const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prueba-web',
    port: process.env.DB_PORT || 3306
};