var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
const ejs=require('ejs')
const {objectId}=require ('mongodb');


const app=express()
app.set('view engine','ejs');                //using dependencies
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/StudentDB'); //creating a database
var db= mongoose.connection;                           //connecting mongodb to js
db.on('error',()=>console.log("Error in connecting to Database"));
db.once('open',()=>console.log("Connected to database"))
 
const studentSchema=mongoose.Schema({
        StudentId:String,
        Name:String,
        Qualification:String,
        College:String,
        Gender:String,
        Idea:String,
        EstBudget:String,
    });

const Student =mongoose.model("deletion",studentSchema);                               //creating a collection of student
app.get('/',(req,res)=>{
        Student.find(function(err,student){
            if(err){
                    console.log(error);
                }
                else{
                res.render('index.ejs',{
                    student:student})
                }
    })
})
app.post('/signup',(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})
app.post('/details',(req,res)=>
{
    let newstudent=new Student({
        StudentId:req.body.studentStudentId,
        Name:req.body.studentName,
        Qualification:req.body.studentQualification,
        College:req.body.studentCollege,
        Gender:req.body.studentGender,
        Idea:req.body.studentIdea,
        EstBudget:req.body.studentEstBudget,
    });
    newstudent.save();
    res.redirect('/')
})
app.get('/edit/:id',(req,res)=>{
   var id=req.params.id;

   Student.findOne({_id:id},(err,student)=>{
    if(err){
        console.log(error);
    }
    else{
        res.render('edit.ejs',{student:student})
    }
   })
});
app.post('/edit/:id',(req,res)=>{
    var id=req.params.id;
    Student.updateOne({_id:id},{
        
        StudentId:req.body.studentStudentId,
        Name:req.body.studentName,
        Qualification:req.body.studentQualification,
        College:req.body.studentCollege,
        Gender:req.body.studentGender,
        Idea:req.body.studentIdea,
        EstBudget:req.body.studentEstBudget,
    },
    function(err,docs){
        if(err){
            console.log(err)
        }
        else{
            console.log("Updated Docs:",docs);
        }
    })
    res.redirect('/');
})
app.get('/delete/:id',(req,res)=>{
    var id=req.params.id;
    console.log(id);
    var del=Student.findByIdAndDelete(id);
    del.exec((err)=>
    {
        if(err)  throw err;
        res.redirect("/");
    });
});
app.listen(3000);
console.log("Listening on port 3000");
// app.get('/edit/:id',async(req,res)=>{
//     await student.findByIdAndUpdate({"_id":req.params.id});
//     res.redirect('/signup')
// })