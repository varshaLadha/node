var {User} = require('./../models/user');

var authenticate = (req,res,next) => {
    var token = req.header('x-auth');        //used to fetch the header

    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();         //we need to call next to allow middleware to exit and allow another block of code to run
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {authenticate};