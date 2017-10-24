module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        browser: true,
        node: true
    },
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'html'
    ],
    // add your custom rules here
    rules: {
        'space-before-function-paren': 0,
        'indent': ["error", 4, {"SwitchCase": 1}],
        "spaced-comment": ["error", "always", {
            "line": {"markers": ["*package", "!", "/", ","]}
        }],
    },
    globals: {
        "config": true,
    }
}
