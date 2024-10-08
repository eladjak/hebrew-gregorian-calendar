module.exports = {
    extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
    plugins: ['react', 'react-hooks'],
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
      jest: true
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'error',
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        caughtErrors: 'none',
        args: 'after-used'
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
    overrides: [
      {
        files: ['**/*.test.js', '**/*.spec.js'],
        env: {
          jest: true
        }
      }
    ]
  };