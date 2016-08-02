# Point of Tickets
Chrome Extension & Web Server for Printing Software Tickets on Receipt Paper

## Description
This project is a combination chrome extension and web server that allows
users to print a ticket that they are looking at on their browser. The web
server runs on a Tessel 2, which is connected to a Thermal Printer.

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
Simple javascript object. It has the following fields:
- title
- number
- project
- body

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

## Related Projects
- Ticket Printer, my first attempt at this:
https://github.com/JRJurman/ticket-printer
- Tessel Thermal Printer, the inspiration for all of this:
https://github.com/zaccolley/tessel-thermalprinter
