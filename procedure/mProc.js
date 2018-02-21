const mongoose=require('mongoose');
const express=require('express');

mongoose.connect("mongodb://localhost:27017/Test",(err,db) => {
    console.log("connected to database");
})

var app=express();

var sfields=mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    class:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    }
})

var mFields=mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        required:true
    },
    studId:{
        type:Number,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    marks:{
        type:Number,
        required:true
    }
})

var student=mongoose.model('student',sfields);
var marks=mongoose.model('marks',mFields);

/*student.find().then((result) => {
    if(result!=null){
        for(i=0;i<result.length;i++){
            console.log(result[i])
            marks.find({"studId":result[i].get("id")}).then((res)=>{
                console.log(res);
            })
        }
        //console.log(result);
    }
})*/

app.get('/student',(req,ress) =>{
    student.aggregate([
        {
            $lookup: {
                from: "marks",
                localField:"id",
                foreignField:"studId",
                as:"result"
            }
        }
    ]).then((res) => {
        //console.log('Hello')

        ress.send(res)
        // for(let i =0; i < res.length; i++){
        //     ress.send(res[i])
        // }
    })
})

// student.aggregate([
//      {
//          $lookup: {
//              from: "marks",
//              localField:"id",
//              foreignField:"studId",
//              as:"result"
//          }
//      }
//      ]).then((res) => {
//      console.log('Hello')
//
//      for(let i =0; i < res.length; i++){
//          console.log(res[i])
//      }
// })

app.get('/marks',(req,ress) => {
    marks.aggregate([
        {$group:{_id : "$studId",total:{$sum:"$marks"}}},
        {$sort : {_id:1}},
        {
            $lookup:{
                from:"students",
                localField: "_id",
                foreignField:"id",
                as:"result"
            }
        }
    ]).then((res) => {

        ress.send({res:res});

        // for(let i =0; i < res.length; i++){
        //     console.log(res[i])
        // }
    })

})
// marks.aggregate([
//     {$group:{_id : "$studId",total:{$sum:"$marks"}}},
//     {$sort : {_id:1}},
//     {
//         $lookup:{
//             from:"students",
//             localField: "_id",
//             foreignField:"id",
//             as:"result"
//         }
//     }
// ]).then((res) => {
//
//     for(let i =0; i < res.length; i++){
//         console.log(res[i])
//     }
// })

app.get('/studReport/:id',(req,res) => {
    let iddata=req.query.id;
    marks.aggregate([
        {$match:{studId : parseInt(req.params.id)}},
        {$group:{_id:"$studId",total:{$sum:"$marks"}}},
        {
            $lookup:{
                from:"students",
                localField:"_id",
                foreignField:"id",
                as:"result"
            }
        }

    ]).then((result)=>{
        //console.log(result[0].result)
        res.send("Name : "+result[0].result[0].name+"\nClass : "+result[0].result[0].class+"\nTotal Marks : "+result[0].total);
    }).catch((err) =>{
        console.log(err)
    })
})

//fetching students of age greater or equal of age number passed and displaying specified fields value using project
student.aggregate([
    {$match:{age:{$gte:19}}},
    {$project:{name:1,class:1,_id:0}}
]).then((result) =>{
    console.log(result);
})

//counting how many students are there in class 12
student.count({class:"12"},function (err,result) {
    if(err)
        return _next(err)
    console.log(result);
})

//displaying how many distinct class are there
student.distinct("class",function (err,result) {
    if(err)
        return _next(err)
    console.log(result);
})

app.listen(2000,()=>{
    console.log("connected to server");
})