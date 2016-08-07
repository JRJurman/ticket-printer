// ticket-builders/jira.js
// pulls information from a jira ticket page

function scrapeTicket() {

  // pull title
  var titleDOM = document.getElementById("summary-val");
  var title = titleDOM.textContent.trim();

  // pull issue number
  var numberDOM = document.getElementById("key-val");
  var number = numberDOM.textContent;

  // pull project name
  var project = document.getElementById("project-name-val");

  // pull description body, which in this case, is the first comment
  var bodyDOM = document.getElementById("descriptionmodule");
  var body = bodyDOM.textContent.trim();

  // build the ticket object
  var ticket = {
    project: project,
    title: title,
    number: number,
    body: body
  }

  return ticket;

}
