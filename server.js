const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const nodefetch=require('node-fetch')
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
//app.use(express.static('C:\Users\dell\Desktop\my CRUD app\public\style.css' + '/public'));
var http = require('http');
app.use(bodyParser.json())
app.listen(3000, function() {
    console.log('listening on 3000')
  })
 
  const MongoClient = require('mongodb').MongoClient
  MongoClient.connect('mongodb+srv://dbBook:BookStorage@cluster0.xhp4t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useUnifiedTopology: true
  },
   (err, client) => {
    if (err) return console.error(err)
  console.log('Connected to Database')
  const db = client.db('Book-suggestions')
  const booksCollection = db.collection('books')

  app.post('/books', (req, res) => {
      booksCollection.insertOne(req.body)
      .then(result => {
       res.redirect('/')
      }).catch(error => console.error(error))
    console.log('Book added successfully')
  })

  app.get('/', (req, res) => {
    //res.sendFile('C:/Users/dell/Desktop/my CRUD app' + '/index.html')
  
    const cursor =db.collection('books').find().toArray().then(result => {
          //console.log(result)
          res.render('index.ejs', {books: result})
      })
      .catch(error => console.error(error))
      console.log(cursor) 
  })
  
  app.put('/books', (req, res) => {
    //console.log(req.body)

  booksCollection.findOneAndUpdate(
    //query,
    {Author : 'Haruki Murakami'},
    {
      $set: {
        Book: req.body.Book,
        Author: req.body.Author
      }
    },
    {
      upsert:true
    }).then(result => res.json('Success'))
    .catch(error => console.error(error)) 
    })
    
    app.delete('/books', (req,res) => {
      booksCollection.deleteOne(
        {Book: req.body.Book, 
          Author: req.body.Author
         }
      )
      .then(result => {
        if(result.deletedCount===0){
          return res.json('No book to delete')
        }
        res.json(`Deleted Murakami's Book `)
      })
      .catch(error => console.error(error))
    })

  })
  
