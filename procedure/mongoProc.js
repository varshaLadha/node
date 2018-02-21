const express = require('express');
const mongoose=require('mongoose');

var app=express();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var fields=mongoose.Schema({

})

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'Test';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to database");

    const db = client.db(dbName);
    // db.system.save({_id : 'addnumber', value : 'function(x,y){return x+y}'})
    // client.close();
});

app.get('/',(req,res) => {
    db.system.js.find({},(err,ress) => {
        if(!err){
            console.log(ress)
        }else{
            console.log(err)
        }
    })
})

student.aggregate([{
    $lookup: {
        from: "marks",
        localField:"id",
        foreignField:"studId",
        as:"result"
    }
}]).then((result) => {
    console.log(result)
})

app.listen(8552,() => {
    console.log('Server Connected')
})