const express = require("express")
const hdbs = require("express-handlebars")

const pool = require("./db/connection") // Utilizando a conexão com o banco

const app = express()

// Habilitando pegar o body do HTML
app.use(
    express.urlencoded({
        extended: true
    })
)

// Pegando o body em JSON
app.use(express.json())

// HDBS
app.engine('handlebars', hdbs.engine())
app.set('view engine', 'handlebars')

// Habilitando pegar o CSS
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

// Dando um INSERT no banco com o POST de um form
app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pagesqt = req.body.pagesqt

    const querySQL = `INSERT INTO books (title, page) VALUES ('${title}', '${pagesqt}')`

    pool.query(querySQL, function(err) {
        if (err) {
            console.log(err)
        }

        res.redirect('/')
    })
})

// SELECT
app.get('/books', (req, res) => {
    const querySQL = "SELECT * FROM books"

    pool.query(querySQL, function(err, data) {
        if (err) {
            console.log(err)
            return
        }

        const books = data // Pegando a resposta do SELECT

        console.log(books) // Resposta do SELECT em JSON

        res.render('books', { books })
    })
})

// SELECT WHERE
app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const querySQL = `SELECT * FROM books WHERE books.id = ${id}`

    pool.query(querySQL, function(err, data) {
        if (err) {
            console.log(err)
            return
        }

        const book = data[0] // Pegando o primeiro livro único

        res.render('book', { book })
    })
})

// UPDATE
app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id

    const querySQL = `SELECT * FROM books WHERE books.id = ${id}`

    pool.query(querySQL, function(err, data) {
        if (err) {
            console.log(err)
            return
        }

        const book = data[0] // Pegando o primeiro livro único

        res.render('editbook', { book })
    })
})

app.post('/books/updatedbook', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const pagesqt = req.body.pagesqt

    const querySQL = `UPDATE books SET title='${title}', page='${pagesqt}' WHERE books.id='${id}'`

    pool.query(querySQL, function(err) {
        if (err) {
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

// DELETE
app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const querySQL = `DELETE FROM books WHERE books.id='${id}'`

    pool.query(querySQL, function(err) {
        if (err) {
            console.log(err)
            return
        }

        res.redirect('/books')
    })
})

app.listen(3000)