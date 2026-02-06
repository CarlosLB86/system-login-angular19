import db from '../config/db.js';

export const User = {
    create: async (username, email, password, role = 'user') => {
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [username, email, password, role]);
        return result;
    },


    // Find user by email
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query(query, [email]);
        return rows[0];
    },

    // Find user by ID
    findById: async (id) => {
        const query = 'SELECT id, username, email, password, role FROM users WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    // Delete user by ID
    delete: async (id) => {
        const query = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return result;
    },

    // Update user data
    update: async (id, username, email, password) => {
        const query = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
        const [result] = await db.query(query, [username, email, password, id]);
        return result;
    }
};