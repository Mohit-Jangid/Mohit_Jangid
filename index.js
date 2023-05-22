const express = require('express');
const mongodb = require('mongodb');
const favicon = require('serve-favicon');
const path = require('path');
const port = 27017;

// const db = require('./config/mongoose');

const app = express();

const mongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://127.0.0.1:27017/myDB'; // MongoDB connection string

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname,'Images','favicon.ico')));

// app.use(express.static('assets'));
app.use(express.static('/path/to/content'));
app.use('/assets/',express.static('./assets'));
app.use('/Images/',express.static('./Images'));


app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  mongoClient.connect(mongoURL, (err, client) => {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return res.status(500).send('Server Error');
    }

    const db = client.db();
    const collection = db.collection('messages');

    collection.insertOne({ name, email, message }, (err, result) => {
      if (err) {
        console.error('Error inserting document:', err);
        return res.status(500).send('Server Error');
      }

      res.send('Form submitted successfully!');
      client.close();
    });
  });
});

app.get('/', function(req, res){
    return res.render('home');
})

app.listen(port, function(err){
    if (err) {
        console.log("Error in running the server", err);
    }
    console.log('Yup! Server is running on Port', port);
});
