module.exports = {
  parserOptions: {
    project: './tsconfig.json',
  },
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks', 'prettier'],
  rules: {
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
