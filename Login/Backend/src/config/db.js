import mysql from 'mysql2/promise';
import 'dotenv/config';
// Initialize the connection pool directly
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // A standard for small/medium apps
    queueLimit: 0
});

// Perform quick verification with a clean log output
try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connection successful');
    connection.release(); // Important: Release the connection back to the pool after the test
} catch (err) {
    console.error('❌ MySQL Query Execution Error:', err.message);
}

export default pool;