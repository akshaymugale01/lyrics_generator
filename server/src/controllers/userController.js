import sql from "mssql";
import { pool } from "../index.js";

// Create new user
export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ 
                error: 'Name and email are required' 
            });
        }

        if (!pool) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('revievers_name', sql.VarChar, recievers_name)
            .input('recievers_pronous', sql.VarChar, recievers_pronous)
            .input('relation', sql.VarChar, relation)
            .input('message', sql.VarChar, message)
            .input('created_at', sql.DateTime, new Date())
            .query(`
                INSERT INTO users (name, email, created_at)
                OUTPUT INSERTED.id
                VALUES (@name, @email, @created_at)
            `);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            userId: result.recordset[0].id
        });

    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ 
            error: 'Failed to create user',
            details: error.message 
        });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        if (!pool) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const result = await pool.request()
            .query('SELECT id, name, email,revievers_name, recievers_pronous, relation, message, created_at FROM users ORDER BY created_at DESC');

        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch users',
            details: error.message 
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!pool) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT id, name, email,revievers_name, recievers_pronous, relation, message, created_at FROM users WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch user',
            details: error.message 
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!pool) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const result = await pool.request()
            .input('name', sql.VarChar, name)
            .input('email', sql.VarChar, email)
            .input('revievers_name', sql.VarChar, recievers_name)
            .input('recievers_pronous', sql.VarChar, recievers_pronous)
            .input('relation', sql.VarChar, relation)
            .input('message', sql.VarChar, message)
            .input('created_at', sql.DateTime, new Date())
            .query(`
                UPDATE users 
                SET name = @name, email = @email 
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            message: 'User updated successfully'
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ 
            error: 'Failed to update user',
            details: error.message 
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!pool) {
            return res.status(500).json({ error: 'Database not connected' });
        }

        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM users WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ 
            error: 'Failed to delete user',
            details: error.message 
        });
    }
};