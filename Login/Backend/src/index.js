import 'dotenv/config';
import './config/db.js'; // Side-effect import to initialize connection
import app from './app.js';

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log(`🚀 Server in: http://localhost:${PORT}`);
});