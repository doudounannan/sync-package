// app.js
// 用于引入babel，并且启动index.js
require("babel-core/register");
require("./index.js");
require("babel-core").transform("code", {
    plugins: ["transform-runtime"]
});