module.exports = function (app) {

const redirectLogin = (req, res, next) => {



   if (!req.session.userId ) {

     res.redirect('./login')

   } else { next (); }

   }

const { check, validationResult } = require('express-validator');




//connect url / to index.html
    app.get('/', function (req, res) {

        res.render('index.html')

    });


//connect url /about to about.html
    app.get('/about', function (req, res) {
        res.render('about.html');
    });



//conect url /search to search.html
    app.get('/search', function (req, res) {
        res.render("search.html");
    });


//searched results
    app.get('/searchresult', function (req, res) {

	//connect to mongodb
        var MongoClient = require('mongodb').MongoClient;

        var url = 'mongodb://localhost';

        MongoClient.connect(url, function (err, client) {

        //if there is any error it will show that   
	 if (err) throw err;

 	    //check form mybookshopdb database
            var db = client.db('myappdb');

	    //collect from books where name is user given word
            db.collection('food').find({
                name: new RegExp(req.query.keyword)
            }).toArray((findErr, result) => {
                if (findErr) throw findErr;

                else
		   //if the search word match it will show to the searchresult page
                    res.render('searchresult.ejs', {
                        availablefood: result
                    });

		//close the database
                client.close();
            });
        });
    });



//weather page

app.get('/weatherform', function (req, res) {

        res.render("weatherform.html");

    });
 
app.get('/weather', function (req, res) {

         //searching in the database
	const request = require('request');

          

let apiKey = '14e8c54d25efcba92c926ab517106185';

let city = req.query.city;

let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

             

request(url, function (err, response, body) {

  if(err){

    console.log('error:', error);

  } else {

    var weather = JSON.parse(body)

    var wmsg = "<br> <a href= '/'>Home</a> <a href= '/register'>Register</a> <a href= '/login'>Login</a> <a href= '/weatherform'>Weather</a> <a href= '/api'>API</a>"+'<br> <br> It is '+ weather.main.temp + ' degrees in '+ weather.name +'! <br> Feels like: ' + weather.main.feels_like + '<br> Humidity now is:'+ weather.main.humidity + '<br> The wind is: ' + weather.wind.speed;



    res.send (wmsg);

//    res.send(body);

  } 

});

});
      
     
/////weather done////


////api////

app.get('/api', function (req,res) {

     var MongoClient = require('mongodb').MongoClient;

     var url = 'mongodb://localhost';

     MongoClient.connect(url, function (err, client) {

     if (err) throw err                                                                                                                                                

     var db = client.db('myappdb');                                                                                                                                                                   

      db.collection('food').find().toArray((findErr, results) => {                                                                                                                                

      if (findErr) throw findErr;

      else

         res.json(results);                                                                                                                                             

      client.close();                                                                                                                                                   

  });

});

});




///////api done/////
//conect /list to list.html
	//connect mongodb 
    app.get('/list', function (req, res) {

        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';    

    MongoClient.connect(url, function (err, client) {
	//throw error 
            if (err) throw err;

	//check data from my bookshopdb database
            var db = client.db('myappdb');

	//collect books and show as list 
            db.collection('food').find().toArray((findErr, results) => {
                if (findErr) throw findErr;

                else
                    res.render('list.ejs', {
                        availablefood: results
                    });

		//close database
                client.close();
            });
        });
    });


//userlist page
    app.get('/listusers', function (req, res) {

       //connect mongodb
        var MongoClient = require('mongodb').MongoClient;

        var url = 'mongodb://localhost';
        MongoClient.connect(url, function (err, client) {

	 //throw error
            if (err) throw err;

	 // check data from mybookshopsdb database
            var db = client.db('myappdb');

	 //collect user and add to the listuser
            db.collection('user').find().toArray((findErr, results) => {
                if (findErr) throw findErr;

                else
                    res.render('listusers.ejs', {
                        users: results
                    });
		//close database
                client.close();
            })
        })
    })


//conncet url /register to register.html
    app.get('/register', function (req, res) {
        res.render('register.html');
    });


//registerd page, when user register show the confirmation
    app.post('/registered',[check('email').isEmail(),check('password').not().isEmpty().isLength({min: 8})], function (req, res) {

	const errors = validationResult(req);

	const plainPassword = req.sanitize(req.body.password);


        if (!errors.isEmpty()) {



          res.redirect('./register'); }




       else {

        // saving data in store or
	//connect to mongodb
        var MongoClient = require('mongodb').MongoClient;

        var url = 'mongodb://localhost';

        const bcrypt = require('bcrypt');

        const saltRounds = 10;

        const plainPassword = req.body.password;

	//bcrypt the password add salt.
        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword)
            {
                MongoClient.connect(url, function (err, client) {

		//throw error
                    if (err) throw err;

		//collect user and save users name, username and hassed password in mybookshopdb 
                    var db = client.db('myappdb');
                   db.collection('user').insertOne({
                       name: req.body.first,
			lastname: req.body.last,
			username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword
                    });

		//close database
                    client.close();

		//confirm the register with massage
                    res.send('Hello '+ req.body.first + ', You are now registered, Your user name is: ' + req.body.username + ' your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword+"<br><a href='./'>Home</a> <a href ='./login'>Login</a>");
                });
            });
   
}
});

//connect /login to login.html
    app.get('/login', function (req, res) {
        res.render('login.html');
    });


//loggedin page, confirm login
    app.post('/loggedin', function (req, res) {

        //saving data in database
        var MongoClient = require('mongodb').MongoClient;

        var bcrypt = require("bcrypt");

        var url = 'mongodb://localhost';

	//connect to mongodb
        MongoClient.connect(url, (err, client) => {

	  //throw error
            if (err) throw err;

	  // use mybookshopdb database
            var db = client.db('myappdb');

         //collect user where the give name
            db.collection("user").find({
                "username": req.body.username
            }).toArray((err, result) => {

		//if user don't entre anything send an error massage
                if(result.length==0){
                       console.log(result)
			res.send("ACCESS DENIED ");
                }

		//compare the username and password from the database and given  
                result.forEach(user => {

                    bcrypt.compare(req.body.password, user.password, (err, result) => {
                        if (err) throw err;

		//if the result match they can login and get an welcome massage
                        if (result == true) {
			   // **** save user session here, when login is successful

			   req.session.userId = req.body.username;//lab7
                            res.send("  WELCOME! "+"<br><a href='./'>Home</a>"+"<a href='/addfood'>Add Food</a> <a href= '/list'>Food List</a> <a href= '/search'>Search Food</a> ")

                        } else {
		//if the password or username doesn't match user get error me
                            res.send(" ACCESS DENIED  MESSAGE"+"<br><a href='./'>Home</a>")
                        }
                    })

		//close database
                    client.close()
                })
            })
        })
    });


//connect url: /deleteuser to deleteuser.html
app.get('/deleteuser', function (req, res) {

        res.render('deleteuser.html');

    });


//delet prossage and confirmation
app.post('/deleted', function(req,res){

      //saving data in database

      var MongoClient = require('mongodb').MongoClient;

      var bcrypt = require("bcrypt");

      var url = 'mongodb://localhost';

	//connect mongobd
      MongoClient.connect(url, function (err, client) {

	//throw error
      		if(err) throw err;

          else{
	//use mybookshopdb database
            var db = client.db('myappdb');

	     //collect user and remove that user and their details from the database
          	db.collection("user").remove({"username" : req.body.username});

            
	//send a confirm message
            res.send("User "+ req.body.username+" has been removed from the system"+ "<br><a href='./'>Home</a>");     

	//close database
            client.close();
                    
          }     

      });

  });

//logout route                                                                                                  
app.get('/logout', redirectLogin, (req,res) => {

     req.session.destroy(err => {

     if (err) {

       return res.redirect('./')

     }

     res.send('you are now logged out. <a href='+'./'+'>Home</a>');

     })

   })                                                                                                  
                  /////                                                                                
 app.get('/addfood', redirectLogin, function (req, res) {

                                                                                                                                                                                           

        res.render('addfood.html');

                                                                                                                                                                                           

    });                                                     
                                                                                                                                        
    
//added book page, 
    app.post('/foodadded', function (req, res) {

        // saving data in database
        var MongoClient = require('mongodb').MongoClient;

        var url = 'mongodb://localhost';

	//connect to mongodb 
        MongoClient.connect(url, function (err, client) {

	   //throw error
            if (err) throw err;

	   //use mybookshopsdb database
            var db = client.db('myappdb');

	  //insert book name and price to database
            db.collection('food').insertOne({
                name: req.body.name,
                amount: req.body.amount,
		unit: req.body.unit,
		calories: req.body.calories,
		carbs: req.body.carbs,
		fat: req.body.fat,
		protein: req.body.protein,
		salt: req.body.salt,
		sugar: req.body.sugar,

            });

	   //close the database
            client.close();

	  //send a confirmation message with book name and price
            res.send(' This food is added to the database, name: ' + req.body.name + ' Amount: ' + req.body.amount + req.body.unit +'<br />'+'Please check the food list for all information'+ '<br>' + '<a href=' + './' + '>Home</a>' );
        });
    });
}
