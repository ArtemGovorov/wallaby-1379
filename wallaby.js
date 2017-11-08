process.env.NODE_ENV = "test";

const babelConf = require("./.babelrc");

babelConf.plugins.push("jest-hoist");

module.exports = function (wallaby) {
    return {
        files: [
            "src/**/*.snap",
            "src/**/*.ts?(x)",
            "!src/**/*.spec.ts?(x)",
            "!src/**/*.d.ts",
            "package.json",
            ".babelrc.js",
            // Bug1: Doesn't work without these lines
            // { pattern: "node_modules/@babel/**/*", load: true, instrument: false },
            // { pattern: "node_modules/babel-plugin-jest-hoist/**/*", load: true, instrument: false },
        ],
        tests: [
            "src/**/*.spec.ts?(x)"
        ],
        env: {
            type: "node",
            runner: "node"
        },
        compilers: {
            // "**/*.ts?(x)": wallaby.compilers.typeScript({ module: "es2015" })
            "**/*.ts?(x)": wallaby.compilers.babel({
                ...babelConf,
                babel: require("@babel/core")
            })
        },
        testFramework: "jest",
        setup: function () {
            const jestConfig = require("./package.json").jest;
            // delete ts/tsx file extensions so wallaby will use instrumented js/jsx files.
            // Alternatively js/jsx could be moved at top
            // delete jestConfig.moduleFileExtensions;
            wallaby.testFramework.configure(jestConfig);
        }
    };
};