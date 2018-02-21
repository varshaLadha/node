const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({      //user
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            /*validator: (value) => {
                return validator.isEmail(value);
            }, OR below*/
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    tokens: [{
        access: {
            type: String,
            required: true
        }
        ,
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id','email']);
};

UserSchema.methods.generateAuthToken = function () {    //instance methods. We are using function keyword to create function instead of ()
                                                        // function bcoz () does not bind this keyword generateauthtoken function creates token
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({
        access,
        token
    });

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update({
      $pull : {
          tokens: {
              token: token
          }
      }
  });
};

UserSchema.statics.findByToken = function (token) {      //UserSchema.statics is used to generate model methods. This function returns the user object when valid
                                                            //token is passed
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token,'abc123');
    }catch (e) {
        return Promise.reject();
    }

    return User.findOne({
       '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email,password) {
    var User = this;
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve,reject) => {
           bcrypt.compare(password,user.password, (err,res) => {
               if(res){
                    resolve(user);
               }else {
                   reject();
               }
           });
        });
    });
}

UserSchema.pre('save', function(next){      //this middleware gets run every time we insert the data.
                                            // If password is not modified and this function gets run it will hash the hashed
                                            //password which is stored in db and change our password thus we need to check first if password is modified or not
    var user = this;

    if(user.isModified('password')){        //checking if the password was modified by use of user.isModified and providing parameter which we want to checks
        bcrypt.genSalt(10, (err,salt) => {
           bcrypt.hash(user.password,salt, (err,hash) => {
                user.password = hash;
                next();
           });
        });
    }
    else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);      //user collection is created with fields specified in Userschema ie email, password, & tokens array

module.exports = {User}