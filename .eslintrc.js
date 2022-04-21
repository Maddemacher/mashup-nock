module.exports = {
    extends: ["airbnb", "prettier"],
    plugins: ["jest", "prettier"],
    parserOptions: {
        "sourceType": "module",
    },
    env: {
        "jest/globals": true,
    },
    rules: {
        "import/prefer-default-export": "off",
        "prettier/prettier": "error",
        "no-unused-vars": "warn",
        "no-console": "off",
        "func-names": "off",
        "no-process-exit": "off",
        "object-shorthand": "off",
        "class-methods-use-this": "off",
    },
};
