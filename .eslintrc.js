module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended'
  ],
  // 自定义全局变量
  globals: {},

  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    semi: 0,
    '@typescript-eslint/no-implied-eval': 0,
    'import/no-cycle': 0,
    'import/extensions': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'func-names': 0,
    // 'react/jsx-closing-bracket-location': [1, 'after-props'],
    'react/function-component-definition': 0,
    'global-require': 0,
    'require-await': 0,
    'react/jsx-no-useless-fragment': 0,
    'import/no-extraneous-dependencies': 0,
    '@typescript-eslint/require-await': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-argument': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-floating-promises': 0,
    'import/prefer-default-export': 0,
    'no-empty': 0,
    'react/jsx-props-no-spreading': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/require-default-props': 0,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/default-param-last': 0,
    'jsx-a11y/anchor-is-valid': 0,
    '@typescript-eslint/no-unused-vars': 1,
    'no-plusplus': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/restrict-template-expressions': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/unbound-method': 0,
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/no-unresolved': 0,
    'react/destructuring-assignment': 0,
    'consistent-return': 0,
    'jsx-a11y/label-has-associated-control': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0
  }
}
