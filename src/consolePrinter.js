// consolePrinter.js
// console variation of the thermal printer for testing purposes
// it implements the required functions used in webserver.js
// some of the functions, not all, mock their real implementation

var printer = {
  bold: function() {return printer},
  center: function() {return printer},
  horizontalLine: function(len) {console.log("-".repeat(len)); return printer},
  inverse: function() {return printer},
  lineFeed: function(lines) {console.log("\n".repeat(lines)); return printer},
  left: function() {return printer},
  on: function(status, callback) {callback()},
  print: function() {},
  printLine: function(text) {console.log(text); return printer}
};

module.exports = printer;
