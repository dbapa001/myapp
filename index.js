//Express framwork
var express = require ('express')
var bodyParser = require ('body-parser')
var pug = require ('pug')
var session = require('express-session');
var validator = require ('express-validator');


const app = express()

const expressSanitizer = require('express-sanitizer');

const port = 8000

//css file:
app.use(express.static('views'));

app.use(expressSanitizer());

/*this part will create mongodb */

app.use(bodyParser.urlencoded({ extended: true }))

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost/mybookshopdb";
/*connect url for mongodb*/
MongoClient.connect(url, function(err, db) {

//error function
  if (err) throw err;

//shows database created in the console
  console.log("Database created!");

  db.close();

});

///////////////////////////
///added for session management

app.use(session({

    secret: 'somerandomstuffs',

    resave: false,

    saveUninitialized: false,

    cookie: {

        expires: 600000

    }

}));

////////////


//create new express web server:

//create simple express server routes 
require('./routes/main')(app);

//creat simple express server views
app.set('views',__dirname + '/views');

app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

//////////////


//if configured and install correctly it will always show this massage in console.
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

