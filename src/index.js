// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const URL = "http://localhost:3000/quotes";

document.addEventListener("DOMContentLoaded", () => {
  main();
})

function main() {
  loadQuotes();
  const form = document.getElementById("new-quote-form");
  form.addEventListener('submit', addQuote);
}

function loadQuotes() {
  fetch(URL)
  .then(resp => resp.json())
  .then(json => displayQuotes(json))
}

function displayQuotes(quotes) {
  quotes.forEach(displayQuote);
}

function displayQuote(quote) {
  const listItem = document.createElement("li");
  listItem.class = "quote-card";
  const block = document.createElement("blockquote");
  block.className = "blockquote";
  const p = document.createElement("p");
  p.className = "mb-" + quote.id;
  p.textContent = quote.quote;
  const footer = document.createElement("footer");
  footer.className = "blockquote-footer";
  footer.textContent = quote.author;
  const br = document.createElement("br");
  footer.appendChild(br);
  const likeButton = document.createElement("button");
  likeButton.textContent = "Likes: ";
  likeButton.className = "btn-success";
  const numLikes = document.createElement("span");
  numLikes.textContent = 0;
  likeButton.appendChild(numLikes);
  likeButton.addEventListener('click', addLikes);
  const delButton = document.createElement("button");
  delButton.textContent = "Delete";
  delButton.className = "btn-danger";
  delButton.addEventListener('click', deleteQuote);
  block.appendChild(p);
  block.appendChild(footer);
  block.appendChild(likeButton);
  block.appendChild(delButton);
  listItem.appendChild(block);
  document.getElementById("quote-list").appendChild(listItem);
}

function addQuote(event) {
  event.preventDefault();
  const quote = event.target[0].value;
  const author = event.target[1].value;
  //console.log(event);
  fetch(URL, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({quote: quote, author: author})
  })
  .then(resp => resp.json())
  .then(json => displayQuote(json))
}

function addLikes(event) {
  event.preventDefault();
  console.log(event.target.children[0].textContent);
  let likes = parseInt(event.target.children[0].textContent);
  const quoteBlock = event.target.parentElement;
  const quote = quoteBlock.querySelector("p");
  fetch(URL + `/${quote.className.split("-")[1]}`, {
    method: 'PATCH',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({quoteId: parseInt(quote.className.split("-")[1]), likes: likes + 1})
  })
  .then(resp => resp.json())
  .then(json => updateLikes(json, event.target))


  //let likes = event.target.getElementsByTagName("span")[0].textContent;
  //event.target.getElementsByTagName("span")[0].textContent = parseInt(likes) + 1;
}

function updateLikes(quote, button) {
  //let likes = event.target.getElementsByTagName("span")[0].textContent;
  button.children[0].textContent = quote.likes;
  //document.querySelector(`p.mb-${quote.quoteId}`).textContent = quote.like;
}

function deleteQuote(event) {
  const quoteBlock = event.target.parentElement;
  const quote = quoteBlock.querySelector("p");
  console.log(quote.className.split("-")[1]);
  let quoteId = getQuoteId();
  const listQuote = quoteBlock.parentElement;
  fetch(URL + `/${quote.className.split("-")[1]}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(json => {
    listQuote.remove()
  })
}
