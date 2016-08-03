// webserver.js
// a webserver that exposes endpoints to trigger the printer

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

// allow cross origin requests for our print endpoint
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// make sure we have the right server
app.get('/ping', function(req, res) {
  res.sendStatus(204);
});

// print endpoint that triggers a print
app.post('/print', function (req, res, next) {

  // validate the ticket exists, and has the things we want
  var ticket = req.body;
  if (ticket.project == undefined ||
      ticket.title == undefined ||
      ticket.number == undefined ||
      ticket.body == undefined) {
    throw Error("ticket is missing information");
    next();
  }

  // print the JSON
  printer
    .center()
    .horizontalLine(32)
    .inverse(true)
    .printLine(" " + ticket.project + " ")
    .inverse(false)
    .lineFeed(1)
    .bold(true)
    .printLine(ticket.title + " " + ticket.number)
    .bold(false)
    .lineFeed(1)
    .left(true)
    .printLine(ticket.body)
    .lineFeed(7)
    .print(function() {});

});

// Start the server, and print our address on the network
app.listen(3000, function () {
  var ip = os.networkInterfaces().wlan0[0].address;
  console.log('Point of Tickets listening on '+ip+':3000');

  // sometimes, we might not have a console, so this will work too
  printer.on('ready', function(){
    printer
        .center()
        .horizontalLine(16)
        .printLine('Point of Tickets')
        .printLine('listening on:')
        .inverse(true)
        .printLine(' '+ip+':3000 ')
        .inverse(false)
        .lineFeed(5)
        .print(function(){});
  });
});
