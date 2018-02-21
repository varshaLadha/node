const mongoose = require('mongoose');
const validator = require('validator');

var mSchema=mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    subject: {
        type:String,
        required:true,
    },
    marks:{
        type:Number,
        required:true
    }
})

var fields = mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    class : {
        type:String,
        required:true
    },
    email:{
      type:String,
      unique:true,
      required:true,
      validate:{
          validator:validator.isEmail,
          message:"{VALUE} is not valid email"
      }
    },
    marks :[mSchema],
    avail:{
        type:Boolean,
        default:true
    }
})

var Student = mongoose.model('Student',fields);

module.exports ={
    Student
}