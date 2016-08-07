// ticket-builders/github-enterprise-11-10.js
// pulls information from a github issue / PR page
// should work for github enterprise instances that are version 11.10.xxx

function scrapeTicket() {

  // pull header
  // the first child is the title, the second is the issue number
  var headerDOM = document.getElementsByClassName("gh-header-title")[0];

  var titleDOM = headerDOM.children[0];
  var title = titleDOM.textContent.trim();

  var numberDOM = headerDOM.children[1];
  var number = numberDOM.textContent.trim();

  // get the user (org) name
  var userDOM = document.getElementsByClassName("author")[0];
  var user = userDOM.textContent.trim();

  // get the author of the issue / PR
  var authorDOM = document.getElementsByClassName("author")[1];
  var author = authorDOM.textContent.trim();

  // get the repo name
  var repoDOM = document.getElementsByClassName("js-current-repository")[0];
  var repo = repoDOM.textContent.trim();

  // pull description body, which in this case, is the first comment
  var bodyDOM = document.getElementsByClassName("comment-body")[0];
  var body = bodyDOM.textContent.trim();

  // pull the created on date
  var createdDOM = document.getElementsByTagName("time")[0];
  var created = new Date(createdDOM.getAttribute("datetime"));

  // build the ticket object
  var ticket = {
    project: user + "/" + repo,
    title: title,
    number: number,
    body: body,
    author: author,
    created: created.toLocaleDateString()
  }

  return ticket;

}
