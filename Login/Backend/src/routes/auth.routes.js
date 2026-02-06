import { Router } from 'express';
import { register, login, deleteAccount, updateProfile } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/auth.middlewares.js';

const router = Router();

// --- PUBLIC ROUTES ---
// No token required as the user is not yet authenticated.
router.post('/register', register);
router.post('/login', login);

// --- PRIVATE ROUTES (Require authRequired) ---

// 1. View profile
router.get('/perfil', authRequired, (req, res) => {
    res.json({
        status: 'success',
        message: 'Has pasado al área VIP. ¡Token validado!',
        data: { user: req.user }
    });
});

// 2. Update user information
// Added /:id parameter because Angular sends requests like /update/5
router.put('/update/:id', authRequired, updateProfile);

// 3. Delete account
// Also added /:id to know exactly who to delete
router.delete('/delete/:id', authRequired, deleteAccount);

export default router;