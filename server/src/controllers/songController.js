import sql from "mssql";
// import { pool } from "../index.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSong = async (req, res) => {
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
      setNumber = 1,
    } = req.body;

    if (!name || !recievers_name || !relation) {
      return res.status(400).json({
        error: "Name, receiver name, and relation are required",
      });
    }

    const defaultSystemPrompt = `
    You are a creative songwriter. Generate EXACTLY 8 lines of song lyrics based on the following details:
- Sender: ${name}
- Receiver: ${recievers_name}
- Pronouns: ${recievers_pronous || "they/them"}
- Relationship: ${relation}
- Message/Theme: ${message || "heartfelt and personal"}
- Song Version: Set ${setNumber}

Return only 8 lines of lyrics in this format:
1st line: 10 words, 15 syllables
2nd line: 8 words, 13 syllables
3rd line: 3 words, 4 syllables
4th line: 3 words, 4 syllables
5th line: 10 words, 17 syllables
6th line: 8 words, 14 syllables
7th line: 3 words, 4 syllables
8th line: 3 words, 4 syllables

Make it ${
      setNumber === 1
        ? "heartfelt and emotional"
        : setNumber === 2
        ? "more upbeat and hopeful"
        : "deeply personal and meaningful"
    }.`;

    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;
    const finalUserPrompt =
      userPrompt ||
      `Create a personalized song for ${recievers_name} from ${name}. Make it touching and memorable.`;

    const completion = await openai.chat.completions.create({
      model: model || "gpt-4.1",
      messages: [
        {
          role: "system",
          content: finalSystemPrompt,
        },
        {
          role: "user",
          content: finalUserPrompt,
        },
      ],
      max_completion_tokens: 300,
      temperature: 0.8,
    });


    console.log("OpenAI Completion Response:", completion);

    const aiResponse = completion.choices[0]?.message?.content;

    console.log("AI Response Content:", aiResponse);

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Parse the response into lines
    const generatedLyrics = aiResponse
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^Line \d+:\s*/, "").trim())
      .slice(0, 8);

    const songData = {
      name,
      recievers_name,
      recievers_pronous,
      relation,
      message,
      model: model || "gpt-3.5-turbo",
      systemPrompt: finalSystemPrompt,
      userPrompt: finalUserPrompt,
      lyrics: generatedLyrics,
      setNumber,
      createdAt: new Date(),
      aiResponse: aiResponse, 
    };

    res.json({
      success: true,
      message: `Song Set ${setNumber} generated successfully`,
      data: songData,
    });
  } catch (error) {
    console.error("Generate song error:", error);
    res.status(500).json({
      error: "Failed to generate song",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Save song to database
export const saveSong = async (req, res) => {
  try {
    const { name, recievers_name, relation, lyrics, model } = req.body;

    // if (!pool) {
    //   return res.status(500).json({ error: "Database not connected" });
    // }

    const result = await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("recievers_name", sql.VarChar, recievers_name)
      .input("relation", sql.VarChar, relation)
      .input("lyrics", sql.Text, JSON.stringify(lyrics))
      .input("model", sql.VarChar, model)
      .input("created_at", sql.DateTime, new Date()).query(`
                INSERT INTO songs (name, recievers_name, relation, lyrics, model, created_at)
                OUTPUT INSERTED.id
                VALUES (@name, @recievers_name, @relation, @lyrics, @model, @created_at)
            `);

    res.json({
      success: true,
      message: "Song saved successfully",
      songId: result.recordset[0].id,
    });
  } catch (error) {
    console.error("Save song error:", error);
    res.status(500).json({
      error: "Failed to save song",
      details: error.message,
    });
  }
};

// Get all songs
export const getAllSongs = async (req, res) => {
  try {
    if (!pool) {
      return res.status(500).json({ error: "Database not connected" });
    }

    const result = await pool
      .request()
      .query("SELECT * FROM songs ORDER BY created_at DESC");

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Get songs error:", error);
    res.status(500).json({
      error: "Failed to fetch songs",
      details: error.message,
    });
  }
};

// Get song by ID
export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;

    // if (!pool) {
    //   return res.status(500).json({ error: "Database not connected" });
    // }

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM songs WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json({
      success: true,
      data: result.recordset[0],
    });
  } catch (error) {
    console.error("Get song by ID error:", error);
    res.status(500).json({
      error: "Failed to fetch song",
      details: error.message,
    });
  }
};

// Delete song
export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;

    // if (!pool) {
    //   return res.status(500).json({ error: "Database not connected" });
    // }

    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM songs WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json({
      success: true,
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.error("Delete song error:", error);
    res.status(500).json({
      error: "Failed to delete song",
      details: error.message,
    });
  }
};
