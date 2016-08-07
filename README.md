# Point of Tickets  
This project is a combination chrome extension and web server that allows
users to print a ticket that they are looking at on their browser. The web
server runs on a Tessel 2, which is connected to a Thermal Printer.

## Local Installation
These are the steps to install and run the project on your local machine.

### Download
To install and run this project, you need to download it, and install the node
dependencies. Run the following command in the root of the project.
```
npm install
```

You'll also need to setup your Tessel 2, and install the Tessel 2 command line
interface, `t2-cli`. You can find all these instructions here:
https://tessel.github.io/t2-start/index.html

The `npm start` script included will kick off a `t2 run`, so installing the cli,
either globally or into the project, is important.

### Installing the Chrome Extension
To attach the chrome extension to your browser, open Google Chrome, and navigate
to `chrome://extensions`. Select `Load unpacked extension`, and then select the
`extension` directory in this project.

### Running the Webserver
After connecting the Mini Thermal Printer to the Tessel, with ground connected
to GND, and the Yellow RX cable connected to port 5, it is possible to kick off
the webserver. Simply run the following command, which runs the `webserver.js`
in the root of the directory.
```
npm start
```

If everything is working, the printer should print the Tessel's IP Address. If
the printer does not appear to print anything, try running the example from the
tessel-thermalprinter project, just to make sure everything is up and running.  
https://github.com/zaccolley/tessel-thermalprinter


### Printing a ticket
Now simply go to a github issue page, and click on the chrome extension. Type in
the IP address that the Tessel printed out after starting the webserver, and hit
enter.  

The dialog should say "Server Ready!" If the bottom has three dots "...",
then you may not have the correct address or port. Check the console for any
error logs that might exist.  

If the dialog says "Server Ready!", then you can safely hit the "Print" button,
and see the fruits of your hard labor!

If you want to use the other ticket builders (in the
`extension/ticket-builders` folder) just add a matcher to the `manifest.json`
and reload the script on your client. For example:  
```javascript
"content_scripts": [
  {
    "matches": ["https://jira.potato-factory.com/*"],
    "js": ["ticket-builders/jira.js"]
  },
  // .. other matchers
],
```

## Architecture Design
![Architecture Design](design/Point-of-Tickets-Architecture.png)

### Browser
The client, usually Google Chrome. This is where the chrome extension lives,
so that users can quickly access the printer controls.  

Ticket Builders are also injected into the browser when the URL matches
specific addresses. More on that below.  

The convenience of using the Browser is that we don't need to navigate around
APIs or authentication to get to the ticket. When the user is on the page with
the ticket they want to print, they can print it, with no access issues.

### Ticket Builders (Content Scripts)
Injected javascript that understands which DOM elements are important, and
pulls them for our Ticket JSON. They provide this JSON for the Popover.  

Chrome Extensions allow different Content Scripts to be injected based on
matching URLs. This means we can inject different scrapers for different URLs.
That is to say, github will only load the github scraper, and JIRA will only
load the JIRA scraper, and so on...

### Ticket (JSON)
Simple javascript object. An example ticket:
```javascript
{
  "project": "jrjurman/potato-factory",
  "title": "Missing Potatoes",
  "number": "#15",
  "body": "As a user, I would like more potatoes, so that I..."
}
```

### Popover
The Popover is the dialog that shows up when you click on the chrome extension.
The Popover is where users can initiate a print.  

The Popover is also where users enter the ip address of the tessel. This is
required to connect the Browser to the Webserver. When the user initiates a
print, the Popover actually makes a POST request to the webserver with the
ticket object.  

The Popover can also ping the server. Simply hit `enter` when on the ip address
input field.

### Webserver
The Webserver is what runs on the Tessel 2. It exposes the http endpoints, and
interacts with the Thermal Receipt Printer. When the webserver receives a
ticket from a post request, it prints the ticket information on the printer.  

## Hardware

### Tessel 2
The Tessel 2 is a small prototyping device that can run Node, Python, or Rust.
It has serial ports which can connect to arduino hardware. For more information,
check the website: https://tessel.io/

### Mini Thermal Receipt Printer
The Mini Thermal Receipt Printer is a tiny receipt printer, similar to what you
would see in any shop or restaurant. It uses no ink, and prints on special
receipt paper. For more information, check the website:
https://www.adafruit.com/products/597  

## Contributing
If you would like to help or suggest something for the project, feel free to
create a git issue, or fork the project and make a PR.

## Related Projects
- Ticket Printer, a different approach to printing tickets:
https://github.com/JRJurman/ticket-printer
- Tessel Thermal Printer, the inspiration for all of this:
https://github.com/zaccolley/tessel-thermalprinter
