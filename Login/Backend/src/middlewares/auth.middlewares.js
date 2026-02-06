import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config/config.js'; // <--- IMPORTANT: Must use the same secret key as the controller

/**
 * Authentication Middleware (The "Gatekeeper")
 */
export const authRequired = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Permission denied. No access token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        // 3. Verify the signature using the centralized secret key
        // If TOKEN_SECRET changes in the .env file, it updates here automatically.
        const decoded = jwt.verify(token, TOKEN_SECRET);

        // 4. Attach decoded data (ID and role) to the 'req' object
        req.user = decoded;

        next();

    } catch (error) {
        // 5. Log the error internally for debugging, but return a generic message to the client for security purposes.
        console.error('Auth Middleware Error:', error.message);

        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token.'
        });
    }
};