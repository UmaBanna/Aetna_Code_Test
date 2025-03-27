/**
 * Unit Tests for Movie Service
 *
 * These tests isolate and verify the behavior of the service layer
 * by mocking the database interactions using Jest.
 */

const { db, attachRatingsDb } = require('../../src/utils/db');
const movieService = require('../../src/services/movieService');

jest.mock('../../src/utils/db'); // Uses tests/__mocks__/db.js automatically

describe('Movie Service', () => {
  /**
   * Reset all mocks before each test to ensure test isolation
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: listAllMovies
   * Verifies that a paginated list of movies is returned
   * and that the `db.all` method is called with the correct parameters
   */
  it('should return paginated list of movies', async () => {
    const mockRows = [
      {
        imdbId: 'tt1234567',
        title: 'Test Movie',
        genres: '["Action"]',
        releaseDate: '2000-01-01',
        budget: '$1,000,000',
      },
    ];

    db.all.mockImplementation((query, params, callback) => {
      callback(null, mockRows); // simulate successful DB response
    });

    const result = await movieService.listAllMovies(1, 10);

    expect(result).toEqual(mockRows); // check if result matches mock
    expect(db.all).toHaveBeenCalledTimes(1); // ensure DB was queried
    expect(db.all).toHaveBeenCalledWith(expect.any(String), [10, 0], expect.any(Function));
  });

  /**
   * Test: getMovieDetails
   * Verifies that detailed movie data is returned for a given IMDb ID
   * and that both `attachRatingsDb` and `db.get` are called
   */
  it('should return movie details for valid ID', async () => {
    const mockRow = {
      imdb_id: 'tt1234567',
      title: 'Test Movie',
      genres: '["Drama"]',
      production_companies: '["Test Studio"]',
      original_language: 'en',
      average_rating: 8.5,
    };

    // simulate attachRatingsDb as resolved successfully
    attachRatingsDb.mockResolvedValue();

    // simulate DB fetch successfully
    db.get.mockImplementation((query, params, cb) => cb(null, mockRow));

    const result = await movieService.getMovieDetails('tt1234567');

    expect(result).toEqual(mockRow);
    expect(attachRatingsDb).toHaveBeenCalledTimes(1); // validate attachRatingsDb executed
    expect(db.get).toHaveBeenCalledTimes(1);  // validate movie fetch executed
    expect(db.get).toHaveBeenCalledWith(expect.any(String), ['tt1234567'], expect.any(Function));
  });
});
