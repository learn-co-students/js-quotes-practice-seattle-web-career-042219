// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

  document.addEventListener("DOMContentLoaded", () => {
    main();
  })

  const URL = 'http://localhost:3000/quotes'

  function main() {
    loadQuotes()
    submitQuote()
  }

  // fetch() the quotes
  function loadQuotes(){
  fetch(URL)
  .then(res => res.json())
  .then(json => {
    displayQuotes(json)
    })
  .catch(err => {
    console.log(err)
  })
  }

  //accepts an array of quote objects and iterates
  //thru them to add each one to the page
  function displayQuotes(quotes) {
    quotes.forEach(quote => {
      displayQuote(quote)
    })
  }

  function displayQuote(quote) {

    if (quote.likes === undefined) {
      quote.likes = 0
    }
    // create each of the elements
    const li = document.createElement('li')
    const blockquote = document.createElement('blockquote')
    const p = document.createElement('p')
    const footer = document.createElement('footer')
    const br = document.createElement('br')
    const span = document.createElement('span')
    const likeButton = document.createElement('button')
    const deleteButton = document.createElement('button')

    p.textContent = quote.quote
    footer.textContent = quote.author
    likeButton.textContent = 'Likes:'
    span.textContent = quote.likes
    likeButton.addEventListener('click', () => {
      likeQuote(quote, span)
    })
    likeButton.appendChild(span)
    deleteButton.textContent = 'Delete'
    deleteButton.addEventListener('click', ()=> {
      deleteQuote(quote, li)
    })

    li.classList.add('quote-card')
    blockquote.classList.add('blockquote')
    p.classList.add('mb-0')
    footer.classList.add('blockquote-footer')
    likeButton.classList.add('btn-success')
    deleteButton.classList.add('btn-danger')

    //wire them all together
    li.appendChild(blockquote);
    blockquote.appendChild(p)
    blockquote.appendChild(footer)
    blockquote.appendChild(br)
    blockquote.appendChild(likeButton)
    blockquote.appendChild(deleteButton)


    const ul = document.getElementById('quote-list');
    ul.appendChild(li)

  }

  //sends a DELETE request to the server
  //and removes the quote from the page

  function likeQuote(quote, likesSpan) {
    quote.likes++
    fetch(URL + '/' + quote.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    })
    .then(res => res.json())
    .then(json => {
      likesSpan.textContent = quote.likes
    })
  }

  function deleteQuote(quote, quoteElement) {
    fetch(URL + '/' + quote.id, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(json => {
      console.log('delete success: ', json)
      quoteElement.remove()
    })
    .catch(err=> {
      console.log('delete error: ', err)
    })
  }

  function submitQuote(){
    const newQuoteForm = document.getElementById('new-quote-form')
    const newQuoteInput = document.getElementById('new-quote')
    const newAuthorInput = document.getElementById('author')
    const formSubmit = document.querySelector('.form-group button')
    newQuoteForm.addEventListener('submit', (ev) => {
      addNewQuote(ev, newQuoteInput.value, newAuthorInput.value)
    })

  }

  function addNewQuote(ev, quoteContent, author) {
    ev.preventDefault();
    fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({quote: quoteContent, author: author})
    })
    .then(res => res.json())
    .then(json => {
      displayQuote(json);
    })
  }
