export default {
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Use Babel to transform JavaScript files
  },
  testEnvironment: 'node', // Use Node.js environment for API tests
};