const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

var app=express();

app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.json({urlencoded:true}));

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"test",
    multipleStatements:true
});

con.connect((err) => {
    if(err)
        return console.log(err);
    console.log("connected to database");
})

//procedure taking input age and returning result set of students >= age provided
/*let sql = `CALL ageProcedure(?)`;

con.query(sql,22,(err,result,fields) => {
    if(err)
        return console.log({err});

    result[0].forEach((row) => {
        console.log(row.rollno + " "+ row.name+ " "+row.class+" "+row.age);
    })
    //console.log(result[0])
})

//procedure taking input age and returning result set of students >= age provided takes input as well as returns output
con.query("DROP procedure if exists studCnt; create procedure studCnt(IN sage INT,OUT cnt INT) BEGIN set cnt=(select count(*) from student where age >= sage); END;");
let sql1 = "SET @cnt=0; CALL studCnt(?,@cnt); SELECT @cnt";

con.query(sql1,20,(err,rows) => {
    if(err)
        return console.log(err);
    console.log(rows[2]);
})

//function taking input age and returning result set of students >= age provided
let qry1 = "SELECT studCount(?)";

con.query(qry1,17,(err,rows) => {
    if(err)
        return console.log(err);
    console.log(rows);

// procedure returning student name whose rollno is passed
con.query("SET @sname=''; CALL studName(?,@sname); SELECT @sname",3,(err,rows) => {
    if(err)
        return console.log(err)
    console.log(rows[2])
});
})*/

app.post('/api/student', (req,res) => {
    con.query("CALL studInsert('"+req.body.name+"','"+req.body.class+"',"+req.body.age+")",(err,ress) => {
        if(err)
            return res.status(400).send("error inserting data",err)
        res.status(200).send({"msg":"data inserted successfully"})
    })
})

app.get('/api/student',(req,res) => {
    con.query("CALL studDetail",(err,rows,fields) => {
        if(err)
            return console.log(err);
        //
        // rows[0].forEach((row) => {
        //     console.log(row.rollno + " "+ row.name+ " "+row.class+" "+row.age)
        // })
        res.send({rows:rows[0]});
    })
})

app.get('/api/student/:id',(req,res) => {
    con.query('CALL getStud(?)',req.params.id,(err,ress)=>{
        if(err)
            return res.send(err);

        if(ress[0].length==0)
            return res.send("Invalid roll no. No student exists with such roll no")
        //console.log(ress[0].length);
        res.send({ress:ress[0]});
    })
})

app.delete('/api/student/:id',(req,res) => {
    con.query("CALL deleteStud("+req.params.id+")",(err,ress) => {
        if(err)
            return res.send(err);
        res.send({"msg":"user deleted successfully"});
    })
})

app.put('/api/student/:id',(req,res) => {
    con.query("CALL updateStud('"+req.body.name+"','"+req.body.class+"',"+req.body.age+","+req.params.id+")",(err,ress)=>{
        if(err)
            return res.send(err);
        if(ress["affectedRows"]==0)
            return res.send("Invalid rollno. No such user exixts")
        res.send({"msg":"user updated successfully","ress":ress["affectedRows"]});
    })
})

app.post('/api/marks',(req,res)=> {
    con.query("CALL marksInsert("+req.body.sid+",'"+req.body.sub+"',"+req.body.marks+")",(err,ress) => {
        if(err)
            return res.send(err);
        res.send("marks inserted successfully");
    })
})

app.get('/studName/:id',(req,res) => {
    let id=req.params.id
    con.query("SET @sname=''; CALL studName(?,@sname); SELECT @sname",id,(err,ress) => {
        if(err)
            return res.send(err);
        res.send(ress[2])
    })
})

app.listen(2000,() => {
    console.log("connected to server");
})

