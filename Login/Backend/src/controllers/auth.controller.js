import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { TOKEN_SECRET, TOKEN_EXPIRATION } from '../config/config.js';

/** REGISTER */
export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // 1. Field validation
        if (!username || !email || !password) {
            return res.status(400).json({ status: 'error', message: 'Incomplete request payload' });
        }

        // 2. Check if email already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ status: 'error', message: 'Email is already registered' });
        }

        // 3. Encrypt password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create user in the database
        // Note: Make sure your model returns the ID of the new user
        const newUser = await User.create(username, email, hashedPassword, role || 'user');

        // 5. Reponse for Angular
        // Optional: Perform direct login by returning an authentication token
        return res.status(201).json({ 
            status: 'success', 
            message: 'User created successfully',
            user: { username, email } 
        });

    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

/** LOGIN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Credentials required' });
        }

        const user = await User.findByEmail(email);
        const isMatch = user ? await bcrypt.compare(password, user.password) : false;
        
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { sub: user.id, role: user.role },
            TOKEN_SECRET,
            { expiresIn: TOKEN_EXPIRATION }
        );

        // Return a flat response to match the Angular AuthResponse interface
        return res.status(200).json({
            token,
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                role: user.role 
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

/** DELETE ACCOUNT */
export const deleteAccount = async (req, res) => {
    try {
        // Extract the ID from the URL parameters (/delete/:id)
        const userId = req.params.id || req.user.sub;
        const result = await User.delete(userId);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        return res.status(200).json({ status: 'success', message: 'Account deleted.' });
    } catch (error) {
        console.error('Delete Error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal error' });
    }
};

/** UPDATE PROFILE */
export const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.user.sub; 
        const { username, email, password } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        let finalPassword = user.password;
        if (password) {
            const salt = await bcrypt.genSalt(12);
            finalPassword = await bcrypt.hash(password, salt);
        }

        const finalUsername = username || user.username;
        const finalEmail = email || user.email;

        await User.update(userId, finalUsername, finalEmail, finalPassword);

        // Return updated user info
        return res.status(200).json({
            id: userId,
            username: finalUsername,
            email: finalEmail,
            role: user.role
        });

    } catch (error) {
        console.error('Update Error:', error);
        return res.status(500).json({ status: 'error', message: 'Error while updating user data' });
    }
};