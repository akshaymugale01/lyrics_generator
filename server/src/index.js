import dotenv from "dotenv";
import express from "express";
import corsMiddleware from "./middleware/cors.js";
import { connectDB } from "./config/db.js";
import songRoutes from "./routes/songRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import serverless from "serverless-http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global database pool
// let pool;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/songs', songRoutes);
app.use('/api/users', userRoutes);

// Health check (simplified for live mode)
app.get('/health', async (req, res) => {
    try {
        res.json({ 
            status: 'Server is running (live mode)', 
            database: 'Not connected - live mode only',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'Server error', 
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

// Check if running in Lambda environment
const isLambda = !!process.env.LAMBDA_TASK_ROOT;

// Lambda/Serverless configuration (for potential deployment)
const server = serverless(app);
export const handler = async (event, context) => {
    const response = await server(event, context);
    return response;
};

if (!isLambda) {
    // Local development server
    async function startServer() {
        try {
            console.log('🔄 Starting local development server...');
            console.log('📝 Running in live mode (no database)');
            
            app.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
                console.log(`📊 Health check: http://localhost:${PORT}/health`);
                console.log(`🎵 Songs API: http://localhost:${PORT}/api/songs`);
                console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
                console.log('💡 Live mode - no database storage');
            });
        } catch (error) {
            console.error('❌ Failed to start server:', error.message);
            process.exit(1);
        }
    }

    startServer();
}