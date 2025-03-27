/**
 * Movie Controller
 * Handles HTTP request logic for movie-related API routes.
 * Depends on movieService to fetch data from the database layer.
 */

const movieService = require('../services/movieService');

/**
 * Safely parses a JSON string if it starts with `{` or `[`.
 * Falls back to a default value (usually empty array or object) if parsing fails.
 *
 * @param {string} str - JSON string to parse
 * @param {any} fallback - Fallback value to return if parsing fails
 * @returns {any}
 */
function safeParseJSON(str, fallback = []) {
  if (typeof str === 'string' && (str.trim().startsWith('[') || str.trim().startsWith('{'))) {
    return JSON.parse(str);
  }
  return fallback;
}

/**
 * GET /api/movies
 * Returns a paginated list of all movies.
 * Query Params: page (default: 1), pageSize (default: 50)
 */
exports.listAllMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 50;

  try {
    const movies = await movieService.listAllMovies(page, pageSize);
    const parsedMovies = movies.map(movie => {
      movie.genres = safeParseJSON(movie.genres, []);
      return movie;
    });
    res.json(parsedMovies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/movies/:id
 * Returns full movie details for a given IMDb ID.
 * Path Param: id
 */
exports.getMovieDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const details = await movieService.getMovieDetails(id);
    if (!details) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    details.genres = safeParseJSON(details.genres, []);
    details.production_companies = safeParseJSON(details.production_companies, []);
    details.original_language = details.original_language || 'Unknown';

    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/movies/year/:year
 * Returns paginated list of movies released in a given year.
 * Path Param: year
 * Query Params: page (default: 1), sort (asc|desc, default: asc), pageSize (default: 50)
 */
exports.getMoviesByYear = async (req, res) => {
  const year = req.params.year;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || 'asc';
  const pageSize = parseInt(req.query.pageSize) || 50;

  try {
    const movies = await movieService.getMoviesByYear(year, page, sort, pageSize);
    const parsedMovies = movies.map(movie => {
      movie.genres = safeParseJSON(movie.genres, []);
      return movie;
    });
    res.json(parsedMovies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/movies/genre/:genre
 * Returns paginated list of movies filtered by genre.
 * Path Param: genre
 * Query Params: page (default: 1), pageSize (default: 50)
 */
exports.getMoviesByGenre = async (req, res) => {
  const genre = req.params.genre;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 50;

  try {
    const movies = await movieService.getMoviesByGenre(genre, page, pageSize);
    const parsedMovies = movies.map(movie => {
      movie.genres = safeParseJSON(movie.genres, []);
      return movie;
    });
    res.json(parsedMovies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
