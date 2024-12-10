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
            'curly': 'error', // Require curly braces for all control statements
            'semi': ['error', 'always'], // Require semicolons
            'quotes': ['error', 'single'], // Enforce single quotes
            'eqeqeq': 'error', // Require === and !==
            'no-unused-vars': 'warn', // Warn on unused variables
            'no-multi-spaces': 'error', // Disallow multiple spaces
            'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multiline objects and arrays
            'no-trailing-spaces': 'error', // Disallow trailing whitespace
            'space-before-blocks': 'error', // Require space before blocks
            'keyword-spacing': ['error', { before: true, after: true }], // Require space before and after keywords
            'space-infix-ops': 'error', // Require spaces around operators
            'eol-last': ['error', 'always'], // Require newline at the end of files
            'no-var': 'error', // Disallow var, use let and const instead
            'prefer-const': 'error', // Prefer const over let where possible
            'arrow-spacing': ['error', { before: true, after: true }], // Require space before and after arrow function's arrow
            'no-multiple-empty-lines': ['error', { max: 1 }], // Disallow multiple empty lines
        },
    },
];