module.exports = {
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'prettier'],
  rules: {
    'import/order': [
      'error',
      {
        // groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object', 'type'],
        groups: [
          ['builtin'],
          ['external'],
          ['internal'],
          ['parent', 'sibling', 'index'],
          ['object'],
          ['type'],
        ],
        'newlines-between': 'always',
      },
    ],
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'react/destructuring-assignment': 'off',
    'react/function-component-definition': 'off',
  },
}