
const env = process.env.BABEL_ENV || process.env.NODE_ENV;

const config = {
    presets: [
        "@babel/typescript",
        ["@babel/stage-3", { loose: true }],
        "@babel/es2017",
        "@babel/es2016",
        ["@babel/react", { development: env !== "production" }],
    ],
    plugins: [
        "@babel/syntax-object-rest-spread",
        "@babel/proposal-decorators",
        // ["emotion", {
        //     sourceMap: env === "development",
        //     hoist: env === "production",
        //     autoLabel: true,
        //     importedNames: {
        //         styled: "styled",
        //         // Important!!! looks like emotion is turning template tagged literals to non es6 format
        //         css: "realCss",
        //         keyframes: "keyframes",
        //         injectGlobal: "injectGlobal",
        //         fontFace: "fontFace",
        //         merge: "merge"
        //     }
        // }]
    ]
};

if (env === "test") {
    config.plugins.push(
        "@babel/transform-modules-commonjs",
        // "./node_modules/jest-mock-action-creators/babel.js",
        // "jest-easy-mock",
    );
} else if (env === "development") {
    // config.plugins.unshift("react-hot-loader/babel");
}

module.exports = config;