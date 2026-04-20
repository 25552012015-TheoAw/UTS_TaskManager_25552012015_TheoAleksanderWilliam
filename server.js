const express = require('express');
const app = express();
require('dotenv').config();
const logger = require('./middleware/logger.js').default.default.default;
const taskRoutes = require('./routes/tasks.js');

app.use(express.json());
app.use(logger);

// Routes
app.use('/tasks', taskRoutes);

// 404 Handler untuk endpoint tidak dikenal
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));