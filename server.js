const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Serve the static files (HTML, JS, CSS) from the current directory
app.use(express.static(__dirname));

// Endpoint to get models
app.get('/api/models', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:1234/v1/models');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching models:', error);
        res.status(500).json({ error: 'Error fetching models' });
    }
});

// Endpoint for chat completions
app.post('/api/chat', async (req, res) => {
    const userInput = req.body.input; // Capture input from the client

    try {
        const response = await axios.post('http://localhost:1234/v1/chat/completions', {
            messages: [{ role: 'user', content: userInput }],
        });

        res.json({ output: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error generating chat response:', error);
        res.status(500).json({ error: 'Error generating response' });
    }
});

// Serve the index.html file from the current directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



