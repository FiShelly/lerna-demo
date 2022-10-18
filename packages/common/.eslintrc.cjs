module.exports = {
    root: true,
    env: {
        node: true,
        'es6': true,
        'browser': true
    },
    'extends': [
        'eslint:recommended'
    ],
    'globals': {
        '$': true
    },
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unused-vars': 'warn',
        'no-var': 'error',
        'quotes': [ 'error', 'single' ],
        'semi': [ 'error', 'always' ],
        'indent': [ 'error', 4 ],
        'comma-spacing': [ 'warn', {'before': false, 'after': true} ],
        'no-dupe-args': 2, //函数定义的时候不允许出现重复的参数
        'no-dupe-keys': 2, //对象中不允许出现重复的键
        'no-duplicate-case': 2, //switch语句中不允许出现重复的case标签
        'no-empty': 2, //不允许出现空的代码块
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        parser: '@babel/eslint-parser'
    }
};
