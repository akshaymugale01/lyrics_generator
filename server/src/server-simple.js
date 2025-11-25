import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generate song using OpenAI ChatGPT
app.post('/api/songs/generate', async (req, res) => {
    try {
        const { 
            name, 
            recievers_name, 
            recievers_pronous, 
            relation, 
            message, 
            model,
            systemPrompt,
            userPrompt,
            setNumber = 1
        } = req.body;

        // Validate required fields
        if (!name || !recievers_name || !relation) {
            return res.status(400).json({ 
                error: 'Name, receiver name, and relation are required' 
            });
        }

        // Build default system prompt if not provided
        const defaultSystemPrompt = `You are a creative songwriter. Generate EXACTLY 8 lines of song lyrics based on the following details:
- Sender: ${name}
- Receiver: ${recievers_name}
- Pronouns: ${recievers_pronous || 'they/them'}
- Relationship: ${relation}
- Message/Theme: ${message || 'heartfelt and personal'}
- Song Version: Set ${setNumber}

Return only 8 lines of lyrics in this format:
Line 1: [lyrics]
Line 2: [lyrics]
Line 3: [lyrics]
Line 4: [lyrics]
Line 5: [lyrics]
Line 6: [lyrics]
Line 7: [lyrics]
Line 8: [lyrics]

Make it ${setNumber === 1 ? 'heartfelt and emotional' : setNumber === 2 ? 'more upbeat and hopeful' : 'deeply personal and meaningful'}.`;

        const finalSystemPrompt = systemPrompt || defaultSystemPrompt;
        const finalUserPrompt = userPrompt || `Create a personalized song for ${recievers_name} from ${name}. Make it touching and memorable.`;

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: model || 'gpt-3.5-turbo',
            messages: [
                {
                    role: "system",
                    content: finalSystemPrompt
                },
                {
                    role: "user", 
                    content: finalUserPrompt
                }
            ],
            max_tokens: 300,
            temperature: 0.8,
        });

        const aiResponse = completion.choices[0]?.message?.content;
        
        if (!aiResponse) {
            throw new Error('No response from AI');
        }

        // Parse the response into lines
        const generatedLyrics = aiResponse
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.replace(/^Line \d+:\s*/, '').trim())
            .slice(0, 8); // Ensure exactly 8 lines

        const songData = {
            name,
            recievers_name,
            recievers_pronous,
            relation,
            message,
            model: model || 'gpt-3.5-turbo',
            systemPrompt: finalSystemPrompt,
            userPrompt: finalUserPrompt,
            lyrics: generatedLyrics,
            setNumber,
            createdAt: new Date(),
            aiResponse: aiResponse // Keep full AI response for debugging
        };

        res.json({
            success: true,
            message: `Song Set ${setNumber} generated successfully`,
            data: songData
        });

    } catch (error) {
        console.error('Generate song error:', error);
        res.status(500).json({ 
            error: 'Failed to generate song',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Test route
app.get("/", (req, res) => {
    res.json({ 
        message: "Song Generator API is running!",
        status: "success",
        timestamp: new Date().toISOString(),
        openai: process.env.OPENAI_API_KEY ? "Connected" : "Not configured"
    });
});

// Health check route
app.get("/health", (req, res) => {
    res.json({ 
        status: "healthy",
        openai: process.env.OPENAI_API_KEY ? "Ready" : "Missing API Key",
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🎵 Songs API: http://localhost:${PORT}/api/songs/generate`);
    console.log(`🤖 OpenAI: ${process.env.OPENAI_API_KEY ? 'Ready' : 'Not configured'}`);
});