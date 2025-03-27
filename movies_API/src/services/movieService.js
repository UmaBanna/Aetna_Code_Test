/**
 * Movie Service
 * Provides data access and business logic for movie-related operations.
 * Uses async/await wrapped sqlite3 queries for clean database interactions.
 */

const { db, attachRatingsDb } = require('../utils/db');
const { promisify } = require('util');

db.allAsync = promisify(db.all).bind(db);
db.getAsync = promisify(db.get).bind(db);
db.runAsync = promisify(db.run).bind(db);

/**
 * Fetches a paginated list of all movies.
 *
 * @param {number} page - Current page number (1-indexed)
 * @param {number} pageSize - Number of movies per page
 * @returns {Promise<Array>} List of movies
 */
exports.listAllMovies = async (page, pageSize) => {
  const offset = (page - 1) * pageSize;
  const query = `
    SELECT imdbId, title, genres, releaseDate, 
           '$' || printf('%,d', budget) AS budget
    FROM movies
    LIMIT ? OFFSET ?;
  `;
  return db.allAsync(query, [pageSize, offset]);
};

/**
 * Retrieves detailed information for a specific movie by its IMDb ID.
 * Includes joined average rating from the attached `ratings.db`.
 *
 * @param {string} imdbId - IMDb movie ID
 * @returns {Promise<Object>} Detailed movie info
 */
exports.getMovieDetails = async (imdbId) => {
  await attachRatingsDb();

  const query = `
    SELECT 
      m.imdbId AS imdb_id,
      m.title,
      m.overview AS description,
      m.releaseDate AS release_date,
      '$' || printf('%,d', m.budget) AS budget,
      m.runtime,
      m.genres,
      m.language AS original_language,
      m.productionCompanies AS production_companies,
      (
        SELECT AVG(rating) 
        FROM ratingsDb.ratings 
        WHERE ratings.movieId = m.movieId
      ) AS average_rating
    FROM movies m
    WHERE m.imdbId = ?;
  `;

  return db.getAsync(query, [imdbId]);
};

/**
 * Fetches paginated movies filtered by release year, with optional sort order.
 *
 * @param {string} year - Release year
 * @param {number} page - Current page number
 * @param {string} sort - Sort order: 'asc' or 'desc'
 * @param {number} pageSize - Movies per page
 * @returns {Promise<Array>} Filtered movies
 */
exports.getMoviesByYear = async (year, page, sort, pageSize) => {
  const offset = (page - 1) * pageSize;
  const order = sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const query = `
    SELECT imdbId, title, genres, releaseDate, 
           '$' || printf('%,d', budget) AS budget
    FROM movies
    WHERE strftime('%Y', releaseDate) = ?
    ORDER BY releaseDate ${order}
    LIMIT ? OFFSET ?;
  `;

  return db.allAsync(query, [year, pageSize, offset]);
};

/**
 * Fetches paginated movies filtered by genre.
 *
 * @param {string} genre - Genre name
 * @param {number} page - Current page number
 * @param {number} pageSize - Movies per page
 * @returns {Promise<Array>} Matching movies
 */
exports.getMoviesByGenre = async (genre, page, pageSize) => {
  const offset = (page - 1) * pageSize;
  const query = `
    SELECT imdbId, title, genres, releaseDate, 
           '$' || printf('%,d', budget) AS budget
    FROM movies
    WHERE genres LIKE ?
    LIMIT ? OFFSET ?;
  `;

  return db.allAsync(query, [`%${genre}%`, pageSize, offset]);
};
