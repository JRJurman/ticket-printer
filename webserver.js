// webserver.js
// a webserver that exposes endpoints to trigger the printer

// network dependency
var os = require('os');

// figure out what network we're on, so we can display it to the user
var networks = os.networkInterfaces();
// flatten all the possible address into one array
var addresses = Object.keys(networks).reduce(function(addrs, interface) {
  // add all the address we found on this interface to the list of addresses
  return addrs.concat(networks[interface].map(function(i) {return i.address;}));
}, []);

// regex to find the one true ip address
var ipLike = /\d+\.\d+.\d+.\d+/
var ip = addresses.filter(function(address) {
  return (ipLike.test(address) && address !== "127.0.0.1");
})[0];

// webserver dependencies
var express = require('express');
var bodyParser = require('body-parser');

// setup webserver
var app = express();
app.use(bodyParser.json());

// printing dependencies
var printer;

// try to pull in tessel packages
try {
  var tessel = require('tessel');
  var thermalprinter = require('tessel-thermalprinter');

  // setup printer
  printer = thermalprinter.use(tessel.port['A']);
}
catch(e) {
  console.warn("couldn't find tessel packages...");
  console.warn("if you're testing, this is perfectly normal.");

  // if we're testing, or don't have a tessel, fall back on the console
  printer = require('./src/console-printer.js');
}

var blinkLeds;
// function to blink the tessel leds on and off
function blink() {
  if (tessel) {
    tessel.led[1].on();
    tessel.led[2].on();
    tessel.led[3].on();
    blinkLeds = setInterval(function() {
      tessel.led[1].toggle();
      tessel.led[2].toggle();
      tessel.led[3].toggle();
    }, 100);
    setTimeout(function() {
      clearInterval(blinkLeds);
      tessel.led[1].off();
      tessel.led[2].off();
      tessel.led[3].off();
    }, 2500)
  }
}

var patternLeds;
// function to animate the tessel leds in a pattern
function pattern() {
  if (tessel) {
    var switches = ['on', 'off', 'off'];
    tessel.led[1][switches[0]]();
    tessel.led[2][switches[1]]();
    tessel.led[3][switches[2]]();
    patternLeds = setInterval(function() {
      // rotate the switches 
      switches.unshift(switches.pop())
      tessel.led[1][switches[0]]();
      tessel.led[2][switches[1]]();
      tessel.led[3][switches[2]]();
    }, 100);
    setTimeout(function() {
      clearInterval(patternLeds)
      tessel.led[1].off();
      tessel.led[2].off();
      tessel.led[3].off();
    }, 4500);
  }
}

// allow cross origin requests for our print endpoint
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// make sure we have the right server
app.get('/ping', function(req, res) {
  // send nothing, we exist, isn't that enough?!?!
  res.sendStatus(204);
  // blink on the tessel, because we asked if we were here!
  blink();
});

// print endpoint that triggers a print
app.post('/print', function (req, res, next) {

  // do a fancy pattern on the tessel, because we were told to print!
  pattern();

  // validate the ticket exists, and has the things we want
  var ticket = req.body;

  // print the JSON
  printer
    .center()
    .horizontalLine(32)
    .inverse(true)
    .printLine(" " + ticket.project + " ")
    .inverse(false)
    .lineFeed(1)
    .bold(true)
    .printLine(ticket.number)
    .printLine(ticket.title)
    .bold(false)
    .lineFeed(1)
    .left(true)
    .printLine("Author:")
    .right(true)
    .printLine(ticket.author)
    .left(true)
    .printLine("Created on:")
    .right(true)
    .printLine(ticket.created)
    .left(true)
    .lineFeed(1)
    .horizontalLine(32)
    .printLine(ticket.body)
    .lineFeed(7)
    .print(function() {
      res.sendStatus(204);
    });

});

// Start the server
var port = 3000;
app.listen(port, function () {
  // blink on the tessel that we're running!
  blink();

  // log what our ip is on the console
  console.log('Point of Tickets listening on '+ip+':'+port);

  // sometimes, we might not have a console, so this will work too
  printer.on('ready', function(){
    printer
      .center()
      .horizontalLine(16)
      .printLine('Point of Tickets')
      .printLine('listening on:')
      .inverse(true)
      .printLine(' '+ip+':'+port+' ')
      .inverse(false)
      .lineFeed(5)
      .print(function(){});
  });
});
