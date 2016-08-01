// webserver dependencies
var express = require('express');
var bodyParser = require('body-parser');
var os = require('os');

// setup webserver
var app = express();
app.use(bodyParser.json());

// printing dependencies
var tessel = require('tessel');
var thermalprinter = require('tessel-thermalprinter');

// setup printer
var printer = thermalprinter.use(tessel.port['A']);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/', function (req, res, next) {

  // validate the ticket exists, and has the things we want
  var ticket = req.body;
  if (ticket.project == undefined ||
      ticket.title == undefined ||
      ticket.number == undefined ||
      ticket.body == undefined) {
    throw Error("ticket is missing information");
    next();
  }

  // print the ticket on post request
  printer
    .center()
    .horizontalLine(32)
    .inverse(true)
    .printLine(" " + ticket.project + " ")
    .inverse(false)
    .lineFeed(1)
    .big(true)
    .printLine(ticket.title + ticket.number)
    .big(false)
    .lineFeed(1)
    .printLine(ticket.body)
    .lineFeed(10)
    .print(function() {});

});

app.listen(3000, function () {
  var ip = os.networkInterfaces().wlan0[0].address;
  console.log('Example app listening on port '+ip+':3000/');
});
