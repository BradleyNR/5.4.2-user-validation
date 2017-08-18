const express = require('express');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const session = require('express-session');
const parseurl = require('parseurl');

const app = express();

//view
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

let logins = [
  {username: 'username', password: 'password'},
  {username: 'bingo', password: 'name-0'},
  {username: 'tyrion', password: 'fordring'}
]


//middleware
app.use(bodyparser.urlencoded({extended: false}));
app.use(session({
  secret: 'super duper oh my so secure wow hibiscus rose zinger',
  resave: false,
  saveUninitialized: true
}));
//checks to see if the entered username and password are equal to any in the array, if so
//sets a variable to true, if not sets to false
app.use((req, res, next) => {
  // is the user currently trying to go to the login page? Don't redirect if they are.
  let urlPath = parseurl(req).pathname;
  //check to see if the value of validLogin is false and checks to see if the urlPath is not /login
  //FIXES INFINITE LOOP:
  //if valid login is false and you're on the login page, it will return
  //true && false, so it will skip the redirect to login and trigger the next()
  //then, back in our post, it will try to go to the '/ route', triggering the middleware again
  //this time returning true and true (since you're not on login anymore), sending you to the
  //login page
  if (!req.session.validLogin && urlPath != '/login') {
    res.redirect('/login');
  } else {
    next();
  }
});



app.get('/', (req, res) =>{
  res.render('index', {username: req.session.userData});
});

app.get('/login', (req, res) =>{
  res.render('login');
});


app.post('/login', (req, res) => {
  for (var i = 0; i < logins.length; i++) {
    if (logins[i].username == req.body.username && logins[i].password == req.body.password) {
      req.session.validLogin = true;
      req.session.userData = req.body.username;
    }
  }
  //redirect
  res.redirect('/');
});

app.listen(3000);
