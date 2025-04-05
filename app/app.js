// Import express.js
const express = require("express");

// Create express app
var app = express();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});





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
        res.render('index', {data:results});
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


// MY feed page for user that show favourited tips and tips related to games they are playing.

app.get("/MyFeed", async function (req, res){})

//list tips and search through them.

app.get("/Explorer", function(req, res){
    var sql = 'select * from games';
    db.query(sql).then (results => {
        console.log(results)
        res.render('Explorer', {data:results});
    });
});

// This page is to make users post tips that can be seen by other users
app.get("/Create-post", async function(req, res){

})


// need to change this to login/sign up page (route)
//This page is so users can login/sign up
app.get("/Profiles", function (req, res){
    var sql = 'SELECT * FROM user_profiles';
    db.query(sql).then (results => {
        console.log(results)
        res.render('Userprofile', {data:results});
    });
});



// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});