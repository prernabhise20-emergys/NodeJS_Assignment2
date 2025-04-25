module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest', // This tells Jest to use babel-jest for transpiling JavaScript files
    },
    testEnvironment: 'node', // Ensure Jest runs in the Node environment
  };
  