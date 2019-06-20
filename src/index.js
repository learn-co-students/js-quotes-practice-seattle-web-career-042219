document.addEventListener("DOMContentLoaded", () => {
  getCall();
  addListeners();
});

function addListeners() {
  const newQuoteForm = document.getElementById("new-quote-form");
  newQuoteForm.addEventListener("submit", e => {
    e.preventDefault();
    postQuote(e);
  });
}

const getUrl = "http://localhost:3000/quotes?_embed=likes";
const url = "http://localhost:3000/quotes";
const likesUrl = "http://localhost:3000/likes";

function getCall() {
  fetch(getUrl)
    .then(res => res.json())
    .then(quotes => loadQuotes(quotes))
    .catch(err => console.log(err));
}

function loadQuotes(quotes) {
  quotes.forEach(quote => loadQuote(quote));
}

function loadQuote(quote) {
  const quoteList = document.getElementById("quote-list");

  const li = document.createElement("li");
  li.setAttribute("class", "quote-card");

  const blockquote = document.createElement("blockquote");
  blockquote.setAttribute("class", "blockquote");

  const p = document.createElement("p");
  p.setAttribute("class", "mb-0");
  p.innerText = quote.quote;

  const footer = document.createElement("footer");
  footer.setAttribute("class", "blockquote-footer");
  footer.innerText = quote.author;

  const br = document.createElement("br");

  const likesBtn = document.createElement("button");
  likesBtn.setAttribute("class", "btn-success");
  likesBtn.innerText = "Likes: ";
  likesBtn.addEventListener("click", e => {
    e.preventDefault();
    incrementLikes(quote);
  });

  const likesSpan = document.createElement("span");
  likesSpan.innerText = quote.likes.length;

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "btn-danger");
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", e => {
    e.preventDefault();
    handleDelete(li, quote);
  });

  const editBtn = document.createElement("button");
  editBtn.setAttribute("class", "btn-info");
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", e => {
    e.preventDefault();
    populateEdit(li, quote);
  });

  likesBtn.appendChild(likesSpan);

  blockquote.appendChild(p);
  blockquote.appendChild(footer);
  blockquote.appendChild(br);
  blockquote.appendChild(likesBtn);
  blockquote.appendChild(deleteBtn);
  blockquote.appendChild(editBtn);

  li.appendChild(blockquote);

  quoteList.appendChild(li);
}

function postQuote(e) {
  const newQuote = e.target[0].value;
  const newAuthor = e.target[1].value;
  e.target[0].value = "";
  e.target[1].value = "";
  fetch(getUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ quote: newQuote, author: newAuthor })
  })
    .then(res => res.json())
    .then(res => pessRender(newQuote, newAuthor, res))
    .then(json => console.log(json))
    .catch(err => console.log(err));
}

function pessRender(newQuote, newAuthor, res) {
  const quoteList = document.getElementById("quote-list");

  const li = document.createElement("li");
  li.setAttribute("class", "quote-card");

  const blockquote = document.createElement("blockquote");
  blockquote.setAttribute("class", "blockquote");

  const p = document.createElement("p");
  p.setAttribute("class", "mb-0");
  p.innerText = newQuote;

  const footer = document.createElement("footer");
  footer.setAttribute("class", "blockquote-footer");
  footer.innerText = newAuthor;

  const br = document.createElement("br");

  const likesBtn = document.createElement("button");
  likesBtn.setAttribute("class", "btn-success");
  likesBtn.innerText = "Likes: ";

  const likesSpan = document.createElement("span");
  likesSpan.innerText = 0;

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "btn-danger");
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", e => {
    e.preventDefault();
    handleDelete(li, res);
  });

  const editBtn = document.createElement("button");
  editBtn.setAttribute("class", "btn-info");
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", e => {
    e.preventDefault();
    populateEdit(li, quote);
  });

  likesBtn.appendChild(likesSpan);

  blockquote.appendChild(p);
  blockquote.appendChild(footer);
  blockquote.appendChild(br);
  blockquote.appendChild(likesBtn);
  blockquote.appendChild(deleteBtn);
  blockquote.appendChild(editBtn);

  li.appendChild(blockquote);

  quoteList.appendChild(li);
}

function handleDelete(li, res) {
  fetch(url + "/" + res.id, {
    method: "DELETE"
  })
    .then(res => res.json)
    .then(res => console.log(res))
    .then(li.remove())
    .catch(err => console.log(err));
}

function incrementLikes(quote) {
  fetch(likesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      quoteId: parseInt(quote.id, 10),
      createdAt: Date.now()
    })
  });
}

function populateEdit(li, quote) {
  document.getElementById("new-quote").value = quote.quote;
  document.getElementById("author").value = quote.author;
  document.getElementsByClassName("btn btn-primary").innerText = "Update";
}

//   fetch(url + "/" + quote.id, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json"
//     },
//     body: JSON.stringify({ quote: quote.quote, author: quote.author })
//   })
//     .then(res => res.json())
//     .then(updateLi(li, newQuote, newAuthor))
//     .catch(err => console.log(err));
// }

function updateLi(li, newQuote, newAuthor) {
  console.log("updateLi fires");
}
