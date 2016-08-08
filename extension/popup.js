// popup.js
// javascript for the popup dialog

// when the page has loaded
document.addEventListener('DOMContentLoaded', function() {
  // save DOM elements as variables
  var title = document.getElementById("title");
  var location = document.getElementById("location");
  var printButton = document.getElementById("print-button");
  var status = document.getElementById('status');

  // pull localStorage location, if we typed one before
  location.value = localStorage.ipLocation || "127.0.0.1:3000"

  // typing in the location input tag
  location.onkeyup = function(event){
    if(event.keyCode !== 13){
      // update the location address
      localStorage.ipLocation = location.value;
    }
    else {
      // if we hit enter, ping the server
      var pingRequest = new XMLHttpRequest();
      pingRequest.open("GET", "http://"+location.value+"/ping");

      // send the collected data as JSON
      pingRequest.send();

      pingRequest.onload = function () {
        if (pingRequest.status === 204) {
          status.textContent = "Server Ready!";
        }
        else {
          status.textContent = "Could not connect :(";
        }
      };
    }
  };

  // printing
  printButton.onclick = function() {

    status.textContent = "Loading ticket...";

    // regardless of what page we're on, it'll be `scrapeTicket`
    var ticketCode = {code: "scrapeTicket()"};

    // build our ticket by executing "scrapeTicket()" on the active tab
    chrome.tabs.executeScript(undefined, ticketCode, function(ticket) {
      if (ticket[0] === null) {
        // classic mistake, and not obvious without some investigation
        status.textContent = "Error... Did you update the manifest.json?";
        return;
      }
      var postTicket = ticket[0];
      status.textContent = "Sending ticket to server...";

      // build the ajax request to the webserver with our ticket
      var printRequest = new XMLHttpRequest();
      printRequest.open("POST", "http://"+location.value+"/print", true);
      printRequest.setRequestHeader("Content-type", "application/json");

      // send the collected data as JSON
      printRequest.send(JSON.stringify(postTicket));

      printRequest.onload = function () {
        if (printRequest.status === 204) {
          status.textContent = "Printing!";
        }
        else {
          status.textContent = "Could not connect :(";
        }
      };

    });

  }
});
