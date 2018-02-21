require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('body-parser');
const html = require('html');

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app=express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser());
app.set('view engine','ejs')

app.get('/',(req,res) => {
    res.render('index.ejs');
})

app.post('/users', (req,res) => {       //registering user ie creating new user
    var body= _.pick(req.body, ['email','password']);
    var user = new User(body);

    user.save().then(() => {
        //res.send(user);
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth',token).send(user);      //used to set the header
    }).catch((err) => {
        res.status(400).send(err);
    })
});

app.get('/users/me',authenticate, (req,res) => {        //authenticate is middleware that we have created it is also a private route
    res.send(req.user);                                 // used to get user based on the token passed
});

app.post('/users/login', (req,res) => {     //when user logs in add the token value ie token generation
   var body = _.pick(req.body, ['email','password']);
   User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth',token).send(user);
        });
   }).catch((e) => {
        res.status(400).redirect('/');
   });
});

app.delete('/users/me/token', authenticate, (req,res) => {      //when user logs out remove the token value ie token expiration
   req.user.removeToken(req.token).then(() => {
       res.status(200).send();
   },() => {
        res.status(400).send();
    })
});

app.listen(2000, () => console.log("server connected"))