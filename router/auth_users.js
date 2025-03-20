const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
regd_users.use(express.json());
regd_users.use(express.urlencoded({extended:false}));
let users = [];




regd_users.post("/login", (req,res) => {

const{username , password} = req.body;
const usercheck = users.find( users =>  users.username == username && users.password == password );
if(usercheck){
  let accessToken = jwt.sign({data: password}, 'access', { expiresIn: 60 * 60 });
  req.session.authorization = {accessToken, username};
  return res.status(200).send("User successfully logged in");
} else {
  return res.status(208).json({ message: "Invalid Login. Check username and password" });
}

});

regd_users.put("/auth/reviews/:isbn", (req, res) => {

  const isbn = parseInt(req.params.isbn, 10);
var found = false;

  for(var i = 0 ; i < 11 ; i ++){

    if(parseInt(req.params.isbn) == i)
found = true;

  }

if(found && books[isbn].reviews.length !==0 ){
  var reviewindex = books[isbn].reviews.findIndex(reviews =>reviews.username == req.session.authorization.username);
  var review = books[isbn].reviews.find(reviews =>reviews.username == req.session.authorization.username);
  if(review){
    books[isbn].reviews[reviewindex] = {username :req.session.authorization.username , review : req.query.review}
    res.send("review updated")
  }
  else{
  books[isbn].reviews.push({username :req.session.authorization.username , review : req.query.review}) ;    
  res.send("review recivied");
  }
}else{
  const r = {username :req.session.authorization.username , review : req.query.review};
  books[isbn].reviews.push(r) ;    
  res.send( "Frist review recived");
}

});


regd_users.delete("/auth/reviews/:isbn", (req, res) => {

  const isbn = parseInt(req.params.isbn, 10);
var found = false;

  for(var i = 0 ; i < 11 ; i ++){

    if(parseInt(req.params.isbn) == i)
found = true;

  }

if(found && books[isbn].reviews.length !==0 ){
  var newreviews = books[isbn].reviews.filter(reviews =>reviews.username !== req.session.authorization.username);
  books[isbn].reviews = newreviews;
  res.send("Book review deleted");
}

});

module.exports.authenticated = regd_users;
module.exports.users = users;
