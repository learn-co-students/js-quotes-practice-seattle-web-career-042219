// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const URL = 'http://localhost:3000/quotes'

let editQuoteId = 0

document.addEventListener('DOMContentLoaded', () => {
loadQuotes()
addQuote()
})

function loadQuotes() {
  fetch(URL)
  .then(res => res.json())
  .then(quotes => {
    showQuotes(quotes)
  })
}

function showQuotes(quotes) {
    let ul = document.getElementById('quote-list')

    while (ul.firstChild) {
      ul.firstChild.remove()
    }

  quotes.forEach(quote => {
    if (quote.likes === undefined) {
        quote.likes = 0
    }
    showQuote(quote)
  })
}

function showQuote(quote) {

  let ul = document.getElementById('quote-list')
  let li = document.createElement('li')
  let bq = document.createElement('blockquote')
  let p = document.createElement('p')
  let foot = document.createElement('footer')
  let br = document.createElement('br')
  let likeBtn = document.createElement('button')
  let span = document.createElement('span')
  let deleteBtn = document.createElement('button')
  let editBtn = document.createElement('button')

  p.textContent = quote.quote
  foot.textContent = quote.author
  likeBtn.textContent = "Likes: "
  span.textContent = quote.likes
  deleteBtn.textContent = "Delete"
  editBtn.textContent = "Edit"

  deleteBtn.addEventListener('click', () => {
    handleDelete(quote, li)
  })

  editBtn.addEventListener('click', () => {
    handleEdit(quote)
  })

  likeBtn.addEventListener('click', () => {
    addLikes(quote, span)
  })

  li.className = 'quote-card'
  bq.className = "blockquote"
  p.className = "mb-0"
  foot.className = "blockquote-footer"
  likeBtn.className = 'btn-success'
  deleteBtn.className = 'btn-danger'

  ul.appendChild(li)
  li.appendChild(bq)
  bq.appendChild(p)
  bq.appendChild(foot)
  bq.appendChild(br)
  bq.appendChild(likeBtn)
  likeBtn.appendChild(span)
  bq.appendChild(deleteBtn)
  bq.appendChild(editBtn)
}

function addQuote() {
  let form = document.getElementById('new-quote-form')
  let quote = document.getElementById('new-quote')
  let author = document.getElementById('author')


  form.addEventListener('submit', (ev) => {
    ev.preventDefault()
    handleSubmit()
  })
}

function handleSubmit() {

  let newQuote = {
    quote: document.getElementById('new-quote').value,
    author: document.getElementById('author').value
}
  let config = {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newQuote)
  }
  fetch(URL, config)
  .then(res => res.json())
  .then(json => {
    showQuote(json)

  })
}

function handleDelete(quote, delEl) {

  let config = {
    method: 'DELETE',
  }
  fetch(URL + '/' + quote.id, config)
  .then(res => res.json())
  .then(json => {
    delEl.remove()
  })
}

function addLikes(quote, likeSpan) {
  quote.likes++
  let value = {likes: quote.likes}
  let config = {
    method: 'PATCH',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(value)
  }
  fetch(URL + '/' + quote.id, config)
  .then(res => res.json())
  .then(json => {
    likeSpan.textContent = quote.likes
  })
}
function handleEdit(quote) {

editQuoteId = quote.id

  let form = document.getElementById('new-quote-form')
  let q = document.getElementById('new-quote')
  let a = document.getElementById('author')
  let saveBtn = document.querySelector('[type= save]')

  q.value = quote.quote
  a.value = quote.author

  saveBtn.addEventListener('click', (ev) => {
    ev.preventDefault()
    handleSave(quote)
  })
}

function handleSave(quote) {

  let q = document.getElementById('new-quote')
  let a = document.getElementById('author')


  let values = {
    quote: q.value,
    author: a.value
  }
  let config = {
    method: 'PATCH',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(values)
  }
  fetch(URL + '/' + editQuoteId, config)
  .then(res => res.json())
  .then(json => {

    loadQuotes(json)
  })
}
