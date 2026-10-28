
module.exports = {
  testEnvironment: "<rootDir>/jest.environment.cjs",

  testEnvironmentOptions: {
    customExportConditions: ["msw"],
  },

  roots: ["<rootDir>/src"],

  testMatch: ["**/test/**/*.test.[jt]s?(x)"],

  transform: {
    "^.+\\.[cm]?[jt]sx?$": "babel-jest",
  },

  transformIgnorePatterns: [
    "node_modules/(?!(msw|@mswjs|@open-draft|until-async|@bundled-es-modules|rettime)/)",
  ],

  moduleNameMapper: {
    '^\\.\\./api/axios\\.js$': '<rootDir>/src/test/axios.js',
    '^../../api/axios\\.js$': '<rootDir>/src/test/axios.js',
    '^\\.\\./\\.\\./api/axios\\.js$': '<rootDir>/src/test/axios.js',
  },

  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],

  clearMocks: true,
};
