/**
 * Integration Tests for Movie Routes
 *
 * These tests use Supertest to simulate real HTTP requests
 * against the Express app and verify the API responses.
 */

const request = require('supertest');
const express = require('express');
const movieRoutes = require('../../src/routes/movieRoutes');

// Create a lightweight Express app instance with JSON parsing and movie routes
const app = express();
app.use(express.json());
app.use('/api/movies', movieRoutes);

describe('Movie Routes', () => {
  /**
   * Test: GET /api/movies
   * Should return a 200 OK response with an array of movies (paginated)
   */
  it('GET /api/movies should return 200 and an array of movies', async () => {
    const res = await request(app).get('/api/movies?page=1&pageSize=10');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  /**
   * Test: GET /api/movies/:id
   * Should return detailed info for a valid IMDb movie ID
   */
  it('GET /api/movies/tt0111161 should return movie details', async () => {
    const res = await request(app).get('/api/movies/tt0111161');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('imdb_id', 'tt0111161');
  });

  /**
   * Test: GET /api/movies/year/:year
   * Should return a list of movies released in the specified year
   */
  it('GET /api/movies/year/1994 should return movies from 1994', async () => {
    const res = await request(app).get('/api/movies/year/1994?page=1&pageSize=5');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  /**
   * Test: GET /api/movies/genre/:genre
   * Should return a list of movies filtered by the given genre
   */
  it('GET /api/movies/genre/Drama should return drama movies', async () => {
    const res = await request(app).get('/api/movies/genre/Drama?page=1&pageSize=5');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  /**
   * Test: GET /api/movies with invalid query parameters
   * Should return a 400 Bad Request response with a validation error
   */
  it('GET /api/movies with invalid query should return 400', async () => {
    const res = await request(app).get('/api/movies?page=-1&pageSize=abc');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
