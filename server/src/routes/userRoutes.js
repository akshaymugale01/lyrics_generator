import express from "express";
import { 
    createUser, 
    getAllUsers, 
    getUserById,
    updateUser,
    deleteUser 
} from "../controllers/userController.js";

const router = express.Router();

// POST /api/users - Create new user
router.post('/', createUser);

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get specific user
router.get('/:id', getUserById);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

export default router;
