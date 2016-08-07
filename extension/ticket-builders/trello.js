// ticket-builders/trello.js
// pulls information from a trello card modal

function scrapeTicket() {

  // pull title
  var titleDOM = document.getElementsByClassName("window-title")[0];
  var title = titleDOM.textContent.trim();

  // pull card number
  var cardHref = window.location.href.split("/").slice(-1)[0];
  var number = cardHref.split("-")[0];

  // pull project name
  var projectDOM = document.getElementsByClassName("board-header-btn-text")[0];
  var project = projectDOM.textContent.trim();

  // pull description body
  var bodyDOM = document.querySelectorAll(".description-content > .current")[0];
  var body = bodyDOM.textContent.trim();

  // pull the author of the ticket
  var contributorsDOM = document.querySelectorAll(".window-module > * > * > .phenom-desc > .inline-member");
  var authorDOM = contributorsDOM[contributorsDOM.length - 1];
  var author = authorDOM.textContent.trim();

  // pull the created on datetime
  var createdDOM = document.querySelectorAll(".window-module > * > * > * > .date")[0];
  var created = new Date(createdDOM.getAttribute("dt"));

  // build the ticket object
  var ticket = {
    project: project,
    title: title,
    number: number,
    body: body,
    author: author,
    created: created.toLocaleDateString()
  }

  return ticket;

}
