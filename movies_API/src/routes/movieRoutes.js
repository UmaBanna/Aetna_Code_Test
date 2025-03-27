/**
 * Movie Routes
 * Defines all API endpoints for accessing movie data.
 * Includes Joi-based query validation middleware.
 */

const express = require('express');
const router = express.Router();
const Joi = require('joi'); 
const movieController = require('../controllers/movieController');

/**
 * Joi schema for validating query parameters:
 * - page: optional integer >= 1
 * - pageSize: optional integer >= 1
 * - sort: optional string ('asc' or 'desc')
 */
const querySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  pageSize: Joi.number().integer().min(1).optional(),
  sort: Joi.string().valid('asc', 'desc').optional()
});

/**
 * Middleware to validate query parameters using Joi.
 * Returns 400 if invalid.
 */
function validateQuery(req, res, next) {
  const { error } = querySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

/**
 * @route   GET /api/movies
 * @desc    List all movies (paginated)
 * @query   page, pageSize
 * @access  Public
 */
router.get('/', validateQuery, movieController.listAllMovies);

/**
 * @route   GET /api/movies/year/:year
 * @desc    List movies from a specific year (paginated, sortable)
 * @param   {string} year - Release year (e.g., 1994)
 * @query   page, pageSize, sort
 * @access  Public
 */
router.get('/year/:year', validateQuery, movieController.getMoviesByYear);

/**
 * @route   GET /api/movies/genre/:genre
 * @desc    List movies by genre (paginated)
 * @param   {string} genre - Movie genre (e.g., Drama)
 * @query   page, pageSize
 * @access  Public
 */
router.get('/genre/:genre', validateQuery, movieController.getMoviesByGenre);

/**
 * @route   GET /api/movies/:id
 * @desc    Get movie details by IMDb ID
 * @param   {string} id - IMDb ID (e.g., tt0111161)
 * @access  Public
 */
router.get('/:id', movieController.getMovieDetails);

module.exports = router;
