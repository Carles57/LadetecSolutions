
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><body><p id="main">My First JSDOM!</p></body>`);
// This prints "My First JSDOM!"
//console.log(dom.window.document.getElementById("main").textContent);