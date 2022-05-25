module.exports = {
  env: {
    browser: true,
    commonjs: false,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-shadow': 'off',
    'consistent-return': 'off',
    'func-names': 'off',
  },
};
