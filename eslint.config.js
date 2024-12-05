export default [
    { ignores: ['dist'] },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        rules: {
            indent: ['error', 4], // Enforce 4 spaces for indentation
            'no-undef': 'error', // Disallow the use of undeclared variables
            'no-console': 'warn', // Warn on console statements
            'curly': 'error', // Require curly braces for all control statements,
    },
];