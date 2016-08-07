// ticket-builders/jira.js
// pulls information from a jira ticket page

function scrapeTicket() {

  // pull title
  var titleDOM = document.getElementById("summary-val");
  var title = titleDOM.textContent.trim();

  // pull issue number
  var numberDOM = document.getElementById("key-val");
  var number = numberDOM.textContent.trim();

  // pull project name
  var projectDOM = document.getElementById("project-name-val");
  var project = projectDOM.textContent.trim();


  // pull description body
  var bodyDOM = document.getElementById("description-val");
  var body = bodyDOM.textContent.trim();

  // pull the author of the ticket
  var authorDOM = document.getElementById("reporter-val");
  var author = authorDOM.textContent.trim();

  // pull the created on datetime
  var createdDOM = document.getElementById("create-date").children[0];
  var created = new Date(createdDOM.getAttribute("datetime"));

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
