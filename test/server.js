const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const {Student} = require('./Student');

mongoose.connect('mongodb://localhost:27017/Student', () => {
    console.log("connected to db");
})

var app=express();

app.use(bodyParser.json());
app.use(bodyParser());

app.post('/api/student', (req,res) => {
    var stud=new Student();
    stud.id=req.body.id
    stud.name=req.body.name
    stud.class=req.body.class
    stud.email=req.body.email
    stud.marks=req.body.marks


    stud.save().then((result) => {
        res.send({"msg":"User saved successfully"})
    }).catch((err) => {
        res.send({err});
    })

})

app.get('/api/student', (req,res) => {
    Student.find({"avail":"true"}).select("-marks -avail -_id -__v").then((result) => {
        res.send({result})
    }).catch((err) => {
        res.send({err});
    })
})

app.get('/api/student/:id',(req,res) => {
    Student.findOne({"id":req.params.id,"avail":"true"}).select("-marks -avail -_id -__v").then((result) =>{
            res.send({result});
    }).catch((err) =>{
        res.send({err});
    })
})

app.delete('/api/student/:id',(req,res) => {
    Student.findOneAndUpdate({"id":req.params.id},{$set:{"avail":"false"}}).then((result) => {
        if(result==null)
            res.send({"msg":"couldnt update user"})
        else
            res.send({"msg":"user updated successfully"});
    })
})

app.get('/api/marks', (req,res) => {
    Student.find({"avail":"true"}).select("marks -_id").then((result) =>{
        res.send({result});
    }).catch((err) => {
        res.send({err});
    })
})

app.get('/api/marks/student/:id', (req,res) =>{
    Student.findOne({"id":req.params.id,"avail":"true"}).select("marks -_id").then((result) => {
        res.send({result})
    }).catch((err) => {
        res.send(err);
    })
})

app.post('/api/marks',(req,res) => {
    Student.findOneAndUpdate({"id":req.body.id,"avail":"true"},{$push:{"marks":req.body.marks}}).then((result) => {
        if(result==null)
            res.send({"msg":"could nt insert marks"})
        else
            res.send({"msg":"marks inserted successfully"})
    })
})

app.get('/',(req,res) => {
    Student.aggregate([
        {$match:{"class":12}}
    ]).then((result)=>{
        console.log(result)
    })
})

// Student.aggregate([
//     {$match:{class:"12"}}
// ]).then((result)=>{
//     console.log(result)
// })

// Student.find({},{"marks":1,"_id":0}).then((result) => {
//     for(i=0;i<result.length;i++){
//         console.log(result[i])
//     }
//     //console.log(result);
// })

// Student.aggregate([
//     {$match:{class:"12"}},
//     {$group:{_id:"$id",total:{$sum:"$marks"}}}
// ]).then((res)=>{
//     console.log(res);
// })

//calculating marks of student
Student.find({},{_id:0,"marks":1,name:1}).then((result) => {
    for(i=0;i<result.length;i++) {
        console.log(result[i].name);
        var sum=0;
        for(j=0;j<result[i].marks.length;j++){
            console.log(result[i].marks[j].subject," = ",result[i].marks[j].marks);
            sum+=result[i].marks[j].marks;
        }
        console.log("Total : ",sum,"\n")
    }
})

// Student.aggregate([
//     {$group:{_id:"$id",total:{$sum:"$marks.marks"}}},
//     {$sort:{_id:1}}
// ]).then((result) => {
//     console.log(result)
// })

app.listen(2000, (err) =>{
    console.log("connected to server")
});

