import dotenv from "dotenv";
import express from "express";
import corsMiddleware from "./middleware/cors.js";
import { connectDB } from "./config/db.js";
import songRoutes from "./routes/songRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global database pool
let pool;

// Middleware
app.use(corsMid// dleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/songs', songRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', async (req, res) => {
    try {
        if (!pool) {
            return res.status(503).json({ status: 'Database not connected' });
        }
        const result = await pool.request().query('SELECT 1 as test');
        res.json({ 
            status: 'Server is running', 
            database: 'Connected',
            timestamp: new Date().toISOString(),
            test: result.recordset[0]
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'Database connection failed', 
            error: error.message 
        });
    }
});

// Main route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Song Generator API Server',
        version: '1.0.0',
        endpoints: ['/api/songs', '/api/users', '/health']
    });
});



// Start server
async function startServer() {
    try {
        console.log('🔄 Connecting to database...');
        // pool = await connectDB();
        console.log('✅ Database connected successfully');
        
  //    app.listen(PORT, () => {
   //       conso// log(`🚀 Server running on http://localhost:${PORT}`); //          console.log(`📊 Health checkt// tp://localhost:${PORT}/health`);
            console.log(`🎵 Songs ://  http://localhost:${PORT}/api/son)// ;
        });
    } catch (error) {
        console.error('❌ Failed to r// t server:', error.message);
        process.exit(1);
    }
}


// Exporo// ol for use in routes
export { pool };

startServer();// // // // // // // 