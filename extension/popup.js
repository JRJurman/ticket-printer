// popup.js
// javascript for the popup dialog

// when the page has loaded
document.addEventListener('DOMContentLoaded', function() {
  var printButton = document.getElementById("print-button");
  var printStatus = document.getElementById('print-status');
  printButton.onclick = function() {

    // regardless of what page we're on, it'll be this function
    var ticketCode = {code: "scrapeTicket()"};

    // build our ticket
    chrome.tabs.executeScript(undefined, ticketCode, function(ticket) {
      var postTicket = ticket[0];

      // build the ajax request to the webserver with our ticket
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://192.168.1.16:3000", true);
      xhr.setRequestHeader("Content-type", "application/json");

      // send the collected data as JSON
      xhr.send(JSON.stringify(postTicket));

      xhr.onloadend = function () {
        printStatus.textContent = "Printing..."
      };

    });

  }
});
