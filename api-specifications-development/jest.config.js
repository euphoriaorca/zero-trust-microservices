module.exports = {
  testRegex: '/.*\\.spec\\.ts',
  testEnvironment: 'node',
  preset: 'ts-jest',
  // TS takes precedence as we want to avoid build artifacts from being required instead of up-to-date .ts file.
  moduleFileExtensions: ['ts', 'js', 'json'],
};
