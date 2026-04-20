const express = require('express');
const router = express.Router();
const pool = require('../db.js');

// GET /tasks
router.get('/', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /tasks/:id
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /tasks
router.post('/', async(req, res) => {
    try {
        const { title, description } = req.body;

        // Validasi Title
        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Title cannot be empty' });
        }

        const result = await pool.query(
            'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *', [title, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /tasks/:id
router.put('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, is_completed } = req.body;

        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const updated = await pool.query(
            `UPDATE tasks 
       SET title = $1, description = $2, is_completed = $3 
       WHERE id = $4 RETURNING *`, [title, description, is_completed, id]
        );
        res.json(updated.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /tasks/:id
router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err); // Ini akan memunculkan error di terminal VS Code
        res.status(500).json({ error: err.message }); // Ini akan memunculkan detail error di Postman
    }
});

module.exports = router;