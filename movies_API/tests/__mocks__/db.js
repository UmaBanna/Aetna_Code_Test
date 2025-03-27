module.exports = {
  db: {
    all: jest.fn(),
    get: jest.fn(),
    exec: jest.fn(),
    serialize: jest.fn(fn => fn()),
  },
  attachRatingsDb: jest.fn().mockResolvedValue(),
};
