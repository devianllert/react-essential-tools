module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/index',
    '/stories/',
    '/src/utils/',
  ],
  testMatch: [
    '<rootDir>/**/tests/*.test.(ts|tsx)',
  ],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$', '^.+\\.module\\.(css|sass|scss)$'],
};
