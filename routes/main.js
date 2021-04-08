module.exports = function (app) {

    //login in session
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

//------ search page -----
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

 	    //check form myappdb database
            var db = client.db('myappdb');

	    //collect from food where name is user given word
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
//------- search page done--------


//------- update page ------------

//conect url /update to update.html
app.get('/update',redirectLogin, function (req, res) {
    res.render("update.html");
});


//update results (comapare the food to tha database)
app.get('/updatefood',redirectLogin, function (req, res) {

	//connect to mongodb
        var MongoClient = require('mongodb').MongoClient;

        var url = 'mongodb://localhost';

        MongoClient.connect(url, function (err, client) {

        //if there is any error it will show that   
	 if (err) throw err;

 	    //check form myappdb database
            var db = client.db('myappdb');

	    //collect from food where name/keyword is user given word
            db.collection('food').findOne({
                "name": req.query.keyword
            },(findErr, result) => {
                if (findErr) throw findErr;

                else
                if(result!=null){
                    //if the search word match it will show to the searchresult page
                    res.render('updateresult.ejs', {
                        food: result
                    });
                }else{
                    
                    res.render("message.ejs",{title:"Sorry", message:"Food"+ req.query.keyword+" can not found!"});
                }


		//close the database
                client.close();
            });
        });
    });


    //update selected food
app.post("/updateSelectedFood",redirectLogin, function(req,res){

        var MongoClient = require('mongodb').MongoClient;
    
        var url = 'mongodb://localhost';


        //connect mongobd
        MongoClient.connect(url, function (err, client) {

            //throw error
            if(err) throw err;

            else{
            //use myappdb database
            var db = client.db('myappdb');
            db.collection("food").findOne({"name":req.body.name},function(err,result){
                if(err) throw err;
                if(result.user==req.session.userId){                    
                    //collect user and remove that user and their details from the database
                    db.collection("food").updateOne({"name" : req.body.name}, {$set:{"name":req.body.name,
                                    "unit":req.body.unit,
                                    "calories":req.body.calories,
                                    "carbs": req.body.carbs,
                                    "fat":req.body.carbs,
                                    "protein":req.body.protein,
                                    "salt":req.body.salt,
                                    "sugar":req.body.sugar}},function(err, result){
                    if(err) throw err;
                    //send a confirm message
                    res.render("message.ejs",{title:"Done!", message:"Food"+ req.body.name+"has been updated"});

                    });
                }else{
                    
                    res.render("message.ejs",{title:"Sorry", message:"only "+ result.user+" can update this!"});
                }

                //close database
                client.close();
            })
            }     

        });
});

//delet prossage and confirmation
app.post('/deleteSelectedFood',redirectLogin, function(req,res){

    var MongoClient = require('mongodb').MongoClient;

    var url = 'mongodb://localhost';

  //connect mongobd
    MongoClient.connect(url, function (err, client) {

        //throw error
        if(err) throw err;

        else{
            //use myappdb database
            var db = client.db('myappdb');


            db.collection("food").findOne({"name":req.body.name},function(err,result){
                if(err) throw err;
                if(result.user==req.session.userId){                    
                    //collect user and remove that user and their details from the database
                    db.collection("food").deleteOne({"name" : req.body.name},(err, result)=>{
                            if(err) throw err;
                            //send a confirm message
                            res.render("message.ejs",{title:"FOOD ADDED", message:"Food "+ req.body.name+" has been removed from the system"});                          
                    });
                }else{
                    //send a reject message
                    
                    res.render("message.ejs",{title:"Sorry", message:"only"+ result.user+" can update this!"});
                }

                //close database
                client.close();
            })

        }     

    });

});


///--------- update done ------------



//---------- api ----------------

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

//---------- api done --------


//---------- list -------------

//conect /list to list.html
	//connect mongodb 
    app.get('/list', function (req, res) {

        var MongoClient = require('mongodb').MongoClient;
        var url = 'mongodb://localhost';    

    MongoClient.connect(url, function (err, client) {
	//throw error 
            if (err) throw err;

	//check data from myappdb database
            var db = client.db('myappdb');

	//collect food and show as list 
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

    //--------- list done --------------


//------------- register ----------------
    
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

		//collect user and save users name, username and hassed password in myappdb 
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
                   res.render("message.ejs",{title:"WELCOME!", message:'Hello '+ req.body.first + ', You are now registered, Your user name is: ' + req.body.username + ' your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword});
                });
            });
   
}
});
//----------------- register done --------------------


//----------------- login ---------------------

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

	  // use myappdb database
            var db = client.db('myappdb');

         //collect user where the give name
            db.collection("user").find({
                "username": req.body.username
            }).toArray((err, result) => {

		//if user don't entre anything send an error massage
                if(result.length==0){
                       console.log(result)
                       res.render("message.ejs",{title:"ACCESS DENIED!", message:""});

                }

		//compare the username and password from the database and given  
                result.forEach(user => {

                    bcrypt.compare(req.body.password, user.password, (err, result) => {
                        if (err) throw err;

		//if the result match they can login and get an welcome massage
                        if (result == true) {
			   // **** save user session here, when login is successful

			   req.session.userId = req.body.username;//lab7
                            res.render("message.ejs",{title:"Welcome!", message:"welcome back "+ req.body.username});
                            
                        } else {
		//if the password or username doesn't match user get error me
                            
                        res.render("message.ejs",{title:"ACCESS DENIED!", message:"Wrong username or password"});
                        }
                    })

		//close database
                    client.close()
                })
            })
        })
    });


//------------ login done -------------------


//------------ logout ----------------

//logout route                                                                                                  
app.get('/logout', redirectLogin, (req,res) => {

     req.session.destroy(err => {

     if (err) {

       return res.redirect('./')

     }

     res.render("message.ejs",{title:"YOU ARE NOW LOGGED OUT", message:""});

     })

   })                                                                                                  

   //------------ logout done ------------


//----------- add food ---------------
 app.get('/addfood', redirectLogin, function (req, res) {

        res.render('addfood.html');

    });                                                     
    
//added food page, 
    app.post('/foodadded', function (req, res) {

        // saving data in database
        var MongoClient = require('mongodb').MongoClient;

        var url = 'mongodb://localhost';

	//connect to mongodb 
        MongoClient.connect(url, function (err, client) {

	   //throw error
            if (err) throw err;

	   //use myappdb database
            var db = client.db('myappdb');

	  //insert food name and nutritional fact to database
      db.collection("food").findOne({"name":req.body.name},(err, result)=>{
          if(err) throw err;
          console.log(result)
          if(result==null){
            db.collection('food').insertOne({
                name: req.body.name,
                unit: req.body.unit,
                calories: req.body.calories,
                carbs: req.body.carbs,
                fat: req.body.fat,
                protein: req.body.protein,
                salt: req.body.salt,
                sugar: req.body.sugar,
                user: req.session.userId

            });
            res.render("message.ejs",{title:"Added", message:"Food "+ req.body.name+" has been added to the database!"});

          }else{
            res.render("message.ejs",{title:"FOOD ALREADY EXISTS", message:req.body.name +' already exists! Please check the food list for all information'});

          }
        //close the database
          client.close();
      })




	  //send a confirmation message 
        });
    });
}

//-------------- add food done -----------------
