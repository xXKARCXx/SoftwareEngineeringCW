// Import express.js
const express = require("express");

const session = require("express-session");

//get the post model
const Post = require("./models/Post");

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create express app
var app = express();

// Middleware to add currentPath to all views
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
  });

// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');



app.use(session({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Add form data parsing
app.use(express.urlencoded({ extended: true }));



// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// Login routes
app.get("/login", function(req, res) {
    res.render("login", { error: null });
});

app.post("/login", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var sql = 'SELECT * FROM user_profiles WHERE username = ? AND password = ?';
    db.query(sql, [username, password]).then(results => {
        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect("/MyFeed");
        } else {
            res.render("login", { error: "Invalid credentials" });
        }
    }).catch(err => {
        console.log(err);
        res.render("login", { error: "Login error" });
    });
});

app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/login");
});

// Protect routes middleware
function checkAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}


/* Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});
*/


// raw data for tips table
app.get("/Tips-formatted", async function(req, res){
    var sql = 'select * from Tips_Table';
    db.query(sql).then(results => {
        console.log(results)
        db.query(sql).then(results => {
        res.render('Myfeed', {data:results});
        });
    });
});



// formatted data for tips table
app.get("/Tips", async function(req, res){
    var sql = 'select * from Tips_Table';
    db.query(sql).then(results => {
        console.log(results)
        res.json(results);
    });
});

//Routes for application will be defined here

app.get("/game/: ", checkAuth, async function(req, res){
    var sql = 'SELECT * FROM game';
    db.query(sql).then(results => {
        console.log(results)
        res.render('game', {data:results});
    });
}

//! This is for partial working and still needs fixing 
//! The DB still takes no input

app.get("/Cpost", async function (req, res){
    var sql = 'SELECT * FROM POST';
    db.query(sql).then(results => {
        console.log(results)
        res.render('post', {data:results});
    });
});

//! send validation msg to to webpage but did not send data to terminal

app.post('/add-tip', function(req, res){
    try{
        console.log(req.body);
    }catch(err){
        console.error('Error while adding tips;', err.message);
    }
    res.send('Tips added successfully!');
});


//list tips and search through them.

app.get("/explorer", function(req, res){
    var sql = 'select * from POST';
    db.query(sql).then (results => {
        console.log(results)
        res.render('Explorer', {data:results});
    });
});





// need to change this to login/sign up page (route)
//This page is so users can login/sign up
app.get("/profiles", function (req, res){
    var sql = 'SELECT * FROM user_profiles';
    db.query(sql).then (results => {
        console.log(results)
        res.render('Users', {data:results});
    });
});



// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});