const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
public_users.use(express.json());
public_users.use(express.urlencoded({extended:false}));

public_users.post("/register", (req,res) => {

  if(req.body){
const {username , password} = req.body;
const usercheck = users.find( users =>  users.username == username && users.password == password );
if(usercheck)
  res.send("user already exist");
else{
users.push({username :username , password : password });
res.send(`user registered successfully`);
}
  }else
  res.send("plz enter a username");

});


public_users.get('/',function (req, res) {

  return res.send(books);
});

public_users.get('/isbn/:isbn',function (req, res) {

const isbn = parseInt(req.params.isbn,10);

for(var i = 1 ; i < 11 ; i++){

if(isbn == i){
  res.send(books[isbn])
  break;
}
else if(i == 10)
  res.send("not found");

}

 });
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const author = req.params.author;

  for(var i = 1 ; i < 11 ; i++){
  
  if(author == books[i].author){
    res.send(books[i])
    break;
  }
  else if(i == 10)
    res.send("not found");

  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title;

  for(var i = 1 ; i < 11 ; i++){
  
  if(title == books[i].title){
    res.send(books[i])
    break;
  }
  else if(i == 10)
    res.send("not found");

  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  const isbn = parseInt(req.params.isbn,10);
  
  for(var i = 1 ; i < 11 ; i++){
  
  if(isbn == i){
    res.send(books[isbn])
    break;
  }
  else if(i == 10)
    res.send("not found");
  
  }
  
});

module.exports.general = public_users;
