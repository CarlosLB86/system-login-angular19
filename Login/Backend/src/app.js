import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';

const app = express();

// --- Route Gatekeepers / Hotel Security Middleware ---
app.use(morgan('dev')); // Logging incoming requests to the terminal

// Explicit CORS configuration for enhanced security 
app.use(cors({
    origin: 'http://localhost:4200', // Solo permitimos a tu Angular
    credentials: true
}));

app.use(express.json()); // JSON parsing middleware to process incoming requests from Angular
app.use(express.urlencoded({ extended: true })); // Enable parsing for traditional URL-encoded forms

// --- ROUTES  ---
// Critical: This must be placed AFTER express.json()
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Server is live and running with ES Modules on port 3500');
});

// Handle 404 - Route Not Found
app.use((req, res) => {
    res.status(404).json({ message: 'The requested route does not exist on this server' });
});

export default app;