// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

const QUOTES_URL = "http://localhost:3000/quotes"

document.addEventListener('DOMContentLoaded', () => {



function main() {
    fetchQuotes()
    attachListeners()
}

main()

function fetchQuotes() {
    fetch(QUOTES_URL)
    .then(resp => resp.json())
    .then(json => displayQuotes(json))
}

function fetchLike(quoteData, spanElement) {
    if (quoteData.likes === undefined){
        quoteData.likes = 1
        
    } else {
        quoteData.likes++
        
    }
    
    let config = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(quoteData)
    }

    fetch(QUOTES_URL + `/${quoteData.id}`, config)
    .then(resp => resp.json())
    .then(json => {
        spanElement.textContent++
    })
}

function fetchDelete(quoteData, parentElem) {
    let config = {
        method: 'DELETE'
    }

    fetch(QUOTES_URL + `/${quoteData.id}`, config)
    .then(resp => resp.json())
    .then(json => {
        parentElem.remove()
    })
}

function fetchCreateQuote(quote, author, parentElem) {
    let payload = {quote: quote, author: author, likes: 0}
    let config = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    }

    fetch(QUOTES_URL, config)
    .then(resp => resp.json())
    .then(json => {
        parentElem.innerHTML = ""
        displayQuote(json)
        fetchQuotes()
        parentElem.lastChild.remove()
        
    })
}

function fetchEdit(quoteData, quoteElem, authorElem, likesElem) {
    let payload = {quote: }
}

function attachListeners() {
    form = document.getElementById('new-quote-form')
    parentElem = document.getElementById('quote-list')
    form.addEventListener('submit', (ev) => {
        ev.preventDefault()
        console.log(ev)
        let quote = ev.target.elements['quote'].value
        let author = ev.target.elements['author'].value
        fetchCreateQuote(quote, author, parentElem)
    })
}


function displayQuotes(json) {
    json.forEach((quote) => {
        displayQuote(quote)
    })
}



function displayQuote(quoteData) {
    let ul = document.getElementById('quote-list')
    let li = document.createElement('li')
    li.className = 'quote-card'
    let blockQuote = document.createElement('blockquote')
    blockQuote.className = "blockquote"
    let p = document.createElement('p')
    p.textContent = quoteData.quote
    p.className = "mb-0"
    let footer = document.createElement('footer')
    footer.className = "blockquote-footer"
    footer.textContent = quoteData.author
    let br = document.createElement('br')
    let likesButton = document.createElement('button')
    likesButton.className = "btn-success"
    likesButton.textContent = "Likes: "
    let span = document.createElement('span')
    if (quoteData.likes === undefined) {
        span.textContent = 0
    } else {
        span.textContent = quoteData.likes
    }
    
    let deleteButton = document.createElement('button')
    deleteButton.className="btn-danger"
    deleteButton.textContent = "Delete"

    let editButton = document.createElement('button')
    editButton.textContent = "Edit"
    
    ul.appendChild(li)
    li.appendChild(blockQuote)
    blockQuote.appendChild(p)
    blockQuote.appendChild(footer)
    blockQuote.appendChild(br)
    blockQuote.appendChild(likesButton)
    blockQuote.appendChild(editButton)
    likesButton.appendChild(span)
    blockQuote.appendChild(deleteButton)

    let editForm = document.createElement('form')
    

    likesButton.addEventListener('click', () => {
        fetchLike(quoteData, span)
    })
    
    deleteButton.addEventListener('click', () => {
        fetchDelete(quoteData, li)
    })

    editButton.addEventListener('click', () => {

        fetchEdit(quoteData, p, footer, span)
    })
}























})
