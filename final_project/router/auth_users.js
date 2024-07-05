const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session');

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let validusers = users.filter((user) => {
        return (user.unsername === username)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
const app = express();
app.use(session({secret:"fingerprint"},resave=true,saveUninitialized=true));
app.use(express.json());

regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  //err cx - missing username or password
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in, missing credentials."})
  }

  //auth user
  if (authenticatedUser(username, password)) {
    //JWT Generation
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    //record details within session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User log in - success!");
  } else {
    return res.status(208).json({message: "User login unsuccessful - Check username and password."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
