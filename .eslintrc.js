module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        // 禁止在全局范围使用变量和函数声明 
        "sourceType": "module"
    },
    "rules": {
        "eqeqeq": [
            "error",
            "always",
        ],
        // 需要把立即执行的函数包裹起来
        "wrap-iife": [
            "error",
            "any",
        ],
        // 禁止yoda表达式
        "yoda": [
            "error",
        ],
        "no-multi-spaces": "error",
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};