// ticket-builders/github.js
// pulls information from a github issue / PR page

function scrapeTicket() {

  // pull title
  var titleDOM = document.getElementsByClassName("js-issue-title")[0];
  var title = titleDOM.textContent.trim();

  // pull issue number
  var numberDOM = document.getElementsByClassName("gh-header-number")[0];
  var number = numberDOM.textContent;

  // pull repo header
  // we pull out the two links at the top of the page, the user, and the repo
  var projectLinks = document.querySelectorAll(".repohead-details-container > h1 > * > a");
  var user = projectLinks[0].textContent;
  var repo = projectLinks[1].textContent;

  // pull description body, which in this case, is the first comment
  var bodyDOM = document.getElementsByClassName("comment-body")[0];
  var body = bodyDOM.textContent.trim();

  // build the ticket object
  var ticket = {
    project: user + "/" + repo,
    title: title,
    number: number,
    body: body
  }

  return ticket;

}
