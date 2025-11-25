import express from "express";
import { 
    generateSong, 
    getAllSongs, 
    getSongById, 
    saveSong,
    deleteSong 
} from "../controllers/songController.js";

const router = express.Router();

// POST /api/songs/generate - Generate new song
router.post('/generate', generateSong);

// POST /api/songs - Save generated song
router.post('/', saveSong);

// GET /api/songs - Get all songs
router.get('/', getAllSongs);

// GET /api/songs/:id - Get specific song
router.get('/:id', getSongById);

// DELETE /api/songs/:id - Delete song
router.delete('/:id', deleteSong);

export default router;
