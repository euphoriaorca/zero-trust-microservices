const tasks = arr => arr.join(' && ');

module.exports = {
  'hooks': {
    'pre-commit': tasks([
      'yarn test',
      'yarn build',
      'yarn validate',
      'yarn validate-resolved',
    ]),
  },
};
