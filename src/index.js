document.addEventListener("DOMContentLoaded", () => {
  addListeners();
  getCall();
});

let viewSortedResponse = false;

function addListeners() {
  const newQuoteForm = document.getElementById("new-quote-form");
  newQuoteForm.addEventListener("submit", e => {
    e.preventDefault();
    postQuote(e);
  });
  const sortBtn = document.getElementById("sort-button");
  sortBtn.addEventListener("click", e => {
    e.preventDefault();
    sortButtonToggler();
  });
  const sortInServerBtn = document.getElementById("sort-button-server");
  sortInServerBtn.addEventListener("click", e => {
    e.preventDefault();
    getSortedQuotes();
  });
}

const getSortedUrl = "http://localhost:3000/quotes?_sort=author";
const getUrl = "http://localhost:3000/quotes?_embed=likes";
const url = "http://localhost:3000/quotes";
const likesUrl = "http://localhost:3000/likes";

//Get sorted from server

function getSortedQuotes() {
  fetch(getSortedUrl)
    .then(res => res.json())
    .then(quotes => loadQuotes(quotes))
    .catch(err => console.log(err));
}

function sortButtonToggler() {
  const sortBtn = document.getElementById("sort-button");
  viewSortedResponse = !viewSortedResponse;
  viewSortedResponse
    ? (sortBtn.innerText = "View Unsorted")
    : (sortBtn.innerText = "View Sorted");
  getCall();
}

// GET from endpoint

function getCall() {
  fetch(getUrl)
    .then(res => res.json())
    .then(quotes => loadQuotes(quotes))
    .catch(err => console.log(err));
}

function loadQuotes(quotes) {
  const quoteList = document.getElementById("quote-list");
  quoteList.innerHTML = "";

  let newQuotes = [...quotes];
  if (viewSortedResponse) {
    newQuotes.sort(function(a, b) {
      return a.author < b.author ? -1 : 1;
    });
  }
  newQuotes.forEach(quote => loadQuote(quote));
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
    incrementLikes(quote, li);
  });

  const likesSpan = document.createElement("span");
  quote.likes
    ? (likesSpan.innerText = quote.likes.length)
    : (likesSpan.innerText = 0);

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

// POST

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
    .then(quote => loadQuote(quote))
    // .then(json => console.log(json))
    .catch(err => console.log(err));
}

// Likes

function incrementLikes(quote, li) {
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
  })
    .then(res => res.json())
    // .then(res => console.log(res))
    .then(pessRenderLikes(li))
    .catch(err => console.log(err));
}

function pessRenderLikes(li) {
  let likeValue = parseInt(
    li.childNodes[0].childNodes[3].innerText.split(" ")[1],
    10
  );
  likeValue++;
  li.childNodes[0].childNodes[3].innerText = `Likes: ${likeValue}`;
}

// Edit

function populateEdit(li, quote) {
  if (document.getElementById("edit-quote-form")) {
    document.getElementById("edit-quote-form").innerHTML = "";
  }
  const mainDiv = document.getElementById("main-div");

  const editForm = document.createElement("form");
  editForm.setAttribute("id", "edit-quote-form");

  const quoteDiv = document.createElement("div");
  quoteDiv.setAttribute("class", "form-group");

  const editQuoteInput = document.createElement("input");
  editQuoteInput.setAttribute("type", "text");
  editQuoteInput.setAttribute("class", "form-control");
  editQuoteInput.setAttribute("id", "edit-quote");

  const quoteLabel = document.createElement("label");
  quoteLabel.setAttribute("for", editQuoteInput.id);
  quoteLabel.innerHTML = "New Quote";

  const authorDiv = document.createElement("div");
  authorDiv.setAttribute("class", "form-group");

  const editAuthorInput = document.createElement("input");
  editAuthorInput.setAttribute("type", "text");
  editAuthorInput.setAttribute("class", "form-control");
  editAuthorInput.setAttribute("id", "edit-author");

  const authorLabel = document.createElement("label");
  authorLabel.setAttribute("for", editAuthorInput.id);
  authorLabel.innerHTML = "Author";

  const editSubmitBtn = document.createElement("button");
  editSubmitBtn.setAttribute("id", "edit-submit");
  editSubmitBtn.setAttribute("type", "submit");
  editSubmitBtn.setAttribute("class", "btn btn-info");
  editSubmitBtn.innerText = "Submit Edit";

  editForm.addEventListener("submit", e => {
    e.preventDefault();
    handlePatch(li, quote);
  });

  let hr = document.createElement("hr");
  editForm.appendChild(hr);

  quoteDiv.appendChild(quoteLabel);
  quoteDiv.appendChild(editQuoteInput);

  authorDiv.appendChild(authorLabel);
  authorDiv.appendChild(editAuthorInput);

  editForm.appendChild(quoteDiv);
  editForm.appendChild(authorDiv);
  editForm.appendChild(editSubmitBtn);

  mainDiv.appendChild(editForm);

  // editQuoteInput.value = quote.quote;
  // editAuthorInput.value = quote.author;

  editQuoteInput.value = li.childNodes[0].childNodes[0].innerText;
  editAuthorInput.value = li.childNodes[0].childNodes[1].innerText;
}

function handlePatch(li, quote) {
  let editQuoteInput = document.getElementById("edit-quote").value;
  let editAuthorInput = document.getElementById("edit-author").value;
  fetch(url + "/" + quote.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      quote: editQuoteInput,
      author: editAuthorInput
    })
  })
    .then(res => res.json())
    // .then(res => console.log(res))
    .then(updateLi(li, editQuoteInput, editAuthorInput))
    .catch(err => console.log(err));
}

function updateLi(li, editQuoteInput, editAuthorInput) {
  li.childNodes[0].childNodes[0].innerText = editQuoteInput;
  li.childNodes[0].childNodes[1].innerText = editAuthorInput;
  document.getElementById("edit-quote-form").remove();
}

// Delete

function handleDelete(li, res) {
  fetch(url + "/" + res.id, {
    method: "DELETE"
  })
    .then(res => res.json)
    // .then(res => console.log(res))
    .then(li.remove())
    .catch(err => console.log(err));
}
