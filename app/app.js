// Import express.js
const express = require("express");

const session = require("express-session");

// Get the functions in the db.js file to use
const db = require('./services/db');

class Post {
    constructor(id, title, description, created, gameID, userID){
      this.id = id;
      this.title = title;
      this.description = description;
      this.created = created;
      this.gameID = gameID;
      this.userID = userID;
    }
  
    static async getTipsByUser(userID) {
      const sql = `
        SELECT POST.*, GAME.name AS game, USER.username AS author
        FROM POST 
        JOIN GAME ON POST.Game_ID = GAME.Game_ID 
        JOIN USER ON POST.User_ID = USER.User_ID
        WHERE POST.Game_ID = (
          SELECT Preferred_Game_ID FROM USER WHERE User_ID = ?
        )`;
      return await db.query(sql, [userID]);
    }
  
    static async getRandomTips(limit = 10) {
      const sql = `
        SELECT POST.*, GAME.name AS game, USER.username AS author
        FROM POST 
        JOIN GAME ON POST.Game_ID = GAME.Game_ID
        JOIN USER ON POST.User_ID = USER.User_ID
        ORDER BY RAND() LIMIT ${Number(limit)}
      `;
      return await db.query(sql);
    }
  }

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

// Route for MyFeed page
app.get("/MyFeed", async function(req, res) {
    try {
      let tips;
  
      if (req.session.user) {
        console.log("Logged in as:", req.session.user);
        tips = await Post.getTipsByUser(req.session.user.User_ID);
      } else {
        console.log("Guest viewing MyFeed");
        tips = await Post.getRandomTips(10);
      }
  
      console.log("Tips retrieved:", tips.length);
      res.render("Myfeed", { data: tips });
  
    } catch (err) {
      console.error("Error loading MyFeed:", err.message);
      res.status(500).send("Something went wrong loading MyFeed.");
    }
  });
// Add form data parsing
app.use(express.urlencoded({ extended: true }));


// GET: Displays the login page
app.get("/login", function(req, res) {
    res.render("login", { error: null });
});

// POST: Handles the login process
app.post("/login", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var sql = 'SELECT * FROM USER WHERE username = ? AND password = ?';
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

//Routes for application will be defined here

// sql = 'SELECT * FROM GAME';
//     db.query(sql).then(results => {
//         console.log(results)
//         res.render('Tipforgames', {data:results});
//     });

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

app.post('/add-tip', async function(req, res){
    try {
        if (!req.session.user) {
            return res.status(401).send("You must be logged in to post tips.");
        }

        const { title, tip } = req.body;
        const gameID = 1; // Replace this later with form input (dropdown)
        const userID = req.session.user.User_ID;

        const sql = `
            INSERT INTO POST (Title, description, created, Game_ID, USER_ID)
            VALUES (?, ?, NOW(), ?, ?)`;

        await db.query(sql, [title, tip, gameID, userID]);

        res.redirect("/MyFeed");
    } catch(err) {
        console.error('Error while adding tip:', err.message);
        res.status(500).send("Failed to add tip.");
    }
});


//dynamic page for game
app.get("/game/:id", async function(req, res){
    var Game_ID = req.params.id;  
    var sql = 'SELECT * FROM POST WHERE Game_ID = ?';
    db.query(sql, [Game_ID]).then(results => {
        console.log(results)
        res.render('gametip', {data:results});
    });
});


//Main page route
app.get("/", function(req, res){
    var sql = 'select * from POST';
    db.query(sql).then (results => {
        console.log(results)
        res.render('Explorer', {data:results});
    });
});


// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});