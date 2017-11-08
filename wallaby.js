process.env.NODE_ENV = "test";

const babelConf = require("./.babelrc");

babelConf.plugins.push("jest-hoist");

module.exports = function (wallaby) {
    return {
        files: [
            "src/**/*.snap",
            "src/**/*.ts?(x)",
            "!src/**/*.spec.ts?(x)",
            "!src/**/*.d.ts"
        ],
        tests: [
            "src/**/*.spec.ts?(x)"
        ],
        env: {
            type: "node",
            runner: "node"
        },
        compilers: {
            "**/*.ts?(x)": wallaby.compilers.babel({
                ...babelConf,
                babel: require("@babel/core")
            })
        },
        testFramework: "jest",
        setup: function () {
            const jestConfig = require("./package.json").jest;
            jestConfig.transform = {};
            wallaby.testFramework.configure(jestConfig);
        }
    };
};
