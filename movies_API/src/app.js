/**
 * Entry Point - Movie API Server
 *
 * Sets up the Express server, loads environment variables,
 * and registers movie-related routes under the /api/movies path.
 */

const express = require('express');
require('dotenv').config(); // Load environment variables from .env file
const movieRoutes = require('./routes/movieRoutes'); // Import route definitions

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware to parse incoming JSON requests
 */
app.use(express.json());

/**
 * Register movie routes with base path /api/movies
 */
app.use('/api/movies', movieRoutes);

/**
 * Start the server and listen on the configured port
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
