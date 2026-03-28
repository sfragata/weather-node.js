const pluginSecurity = require('eslint-plugin-security');

module.exports = [
  pluginSecurity.configs.recommended,
  {
    files: ['weather.js', 'modules/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'eqeqeq': ['error', 'always'],
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single']
    }
  }
];
