let scrapeEmails = document.getElementById('scrapeEmails');
let list = document.getElementById('emailList');

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Get emails
  let emails = request.emails;
  
  // Display emails on popup
  if (emails == null || emails.length == 0) {
    // No emails
    let li = document.createElement('li');
    li.innerText = 'No emails found';
    list.appendChild(li);
  } else {
    // Display emails
    emails.forEach((email) => {
      let li = document.createElement('li');
      li.innerText = email;
      list.appendChild(li);
    })
  }
}) 

// Button's click event listener
scrapeEmails.addEventListener("click", async () => {
  
  // Get current active tab
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  // Execute script to parse emails on page
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: scrapeEmailsFromPage,
  });

});

// Function to scrape emails
function scrapeEmailsFromPage() {
  // RegEx to parse emails from html code
  const emailRegex = /[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*/gim;

  // Parse emails from the HTML of the page
  let emails  = document.body.innerHTML.match(emailRegex);

  // send emails to popup
  chrome.runtime.sendMessage({emails})
}