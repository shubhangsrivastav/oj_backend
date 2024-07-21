const express=require('express');
const bodyParser = require('body-parser');
const {DBconnections}=require('./database/db.js');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const User =require('./models/user.js');
const Admin=require("./models/admin.js");
const Problem=require('./models/problem.js');
const OaPractice=require('./models/oa.js');
const cors =require("cors");
const dotenv=require('dotenv');
const cookieParser = require('cookie-parser');
const Submission = require("./models/submission.js");
dotenv.config();
const SECRET_KEY=process.env.SECRET_KEY;

const app=express();
DBconnections();

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

const generateJwt=(id,type,userName)=>{
   var token=jwt.sign({id:id,type:type,userName:userName},SECRET_KEY,{expiresIn:"1h"});
    return token;
}
const verify=async(token)=>{
    try{
        const user=await jwt.verify(token,SECRET_KEY);
        console.log(user);
        return user;
    }
    catch(error){
        console.error(error);
    }
}
app.get("/me",async(req,res)=>{
    const token=req.headers.authorisation.split(" ")[1];
    
    console.log(token);
    userDetails= await verify(token);
   
   return res.status(200).json({userDetails});

})
app.post ("/register",async(req,res)=>{
    try {
        //get the data from user
        const {userName,firstName,lastName,email,password}=req.body;
        //check that all the data should exists
        if(!userName || !firstName || !lastName || !email || !password){
            res.status(404).json({msg:"Some of the feilds is still vaccant!"});
        }
        //checking if a user is admin or not.
       
    
        if(userName==="Admin"){
            const alreadyExist=await Admin.findOne({email});
            if(alreadyExist){
               return  res.status(201).json({
                    msg:"Already Registered ! Please Signin"
                })
            }
           //encrypt password
        //    const hashPassword = bcrypt.hashSync(password, 8);
           //save the user to the database
          const user= await Admin.create({
            userName,
            firstName,
            lastName,
            password,
            email
           });
           //generate token for user and send it 
           const token = generateJwt(user._id,"admin",userName);
           //send the response
           const options={
            expires:new Date(Date.now()+(24*60*60*1000)),
            httpOnly:true
        }
            user.password=undefined;
            user._id=undefined;
            res.status(201).cookie("token",token,options).json({
                msg:"Successfull",
                user,
                type:"admin",
                token
            });
        }
        else{
       //check if the user is alredy registered or not
        const alreadyExist=await User.findOne({email});
        if(alreadyExist){
            res.status(201).json({
                msg:"Already Registered ! Please Signin"
            })
        }
       //encrypt password
    //    const hashPassword = bcrypt.hashSync(password, 8);
       //save the user to the database
      const user= await User.create({
        userName,
        firstName,
        lastName,
        password,
        email
       });
       //generate token for user and send it 
       const token = generateJwt(user._id,"user",userName);
       //send the response
       
        user.password=undefined;
        user._id=undefined;
        res.status(201).json({
            msg:"Successfull",
            user,
            type:"user",
            token
        });
    }
    }
     catch (error) {
        console.error(error);
    }
})

app.post("/signin",async(req,res)=>{
    try{
        //get the user data
        
        const {email,password}=req.body;
        //check all the data is present or not
        if(!email || !password){
            res.status(203).json({msg:"Bad request! Some data is missing."});
        }
        //check registered or not
        let user=await Admin.findOne({email});
        if(user){
            if(password!=user.password){
                res.status(203).json({msg:"Bad request ! Password is incorrect."});
            }
            //generate Jwt
        const token=generateJwt(user._id,"admin",user.userName);
        console.log(token);
        //send the response
        user.password=undefined;
        user._id=undefined;
        return res.status(200).json({
            msg:"Successfull",
            user,
            type:"admin",
            token
        })
        }
        
        user=await User.findOne({email});
        if(!user){
           return  res.status(203).json({msg:"User not registered! Please Register "});
        }
        //compare the password
        // const enteredPassword =await bcrypt.compare(password,user.password);
        
        if(password!=user.password){
            return res.status(203).json({msg:"Bad request ! Password is incorrect."});
        }
        //generate Jwt
        const token=generateJwt(user._id,"user",user.userName);
        console.log(token);
        //send the response
        user.password=undefined;
        user._id=undefined;
        return res.status(200).json({
            msg:"Successfull",
            user,
            type:"user",
            token
        })
    }
    catch(error){
        console.error(error);
    }
})
// add a problem
app.post("/addproblem",async(req,res)=>{
    try{
    const {title,description,input,output,difficulty,shortdes,submissions,exampleInput,exampleOutput,testCaseInput,testCaseOutput}=req.body;
    if(!title || !description || !input || !output || !difficulty || !shortdes || !submissions || !exampleInput || !exampleOutput || !testCaseInput || !testCaseOutput){
        res.status(203).json({msg:"Some feilds are empty! Kindly fill them"});
    }
    

    const problem = await Problem.create({
        title,
        description,
        input,
        output,
        difficulty,
        shortdes,
        submissions,
        exampleInput,
        exampleOutput,
        testCaseInput,
        testCaseOutput,

    });
    return res.status(200).json({msg:"Successfull",
        problem
    });}
    catch(error){
        console.error(error);
    }
})
app.put("/updateproblem/:pid",async(req,res)=>{
    try{
    const {title,description,input,output,difficulty,shortdes,submissions,exampleInput,exampleOutput,testCaseInput,testCaseOutput}=req.body;
    
    if(!title || !description || !input || !output || !difficulty || !shortdes || !submissions || !exampleInput || !exampleOutput || !testCaseInput || !testCaseOutput){
        res.status(203).json({msg:"Some feilds are empty! Kindly fill them"});
    }
    const updatedProblem={
        title,
        description,
        input,
        output,
        difficulty,
        shortdes,
        submissions,
        exampleInput,
        exampleOutput,
        testCaseInput,
        testCaseOutput
    }
    const update=await Problem.findByIdAndUpdate(req.params.pid,updatedProblem,{new:true});
   if(!update){
    return res.status(400).json({message:"Problem not found"});
   }
   else{
    return res.status(200).json({msg:"Successfull",
    updatedProblem
});
}
    }
    catch(error){
        console.error(error);
    }
})
app.delete("/delete/:pid",async(req,res)=>{
try {
    const del=await Problem.findByIdAndDelete(req.params.pid);
    if(!del){
        return res.status(400).json({message:"Problem not found!"});
    }
    else{
        return res.status(200).json({message:"Successfull"});
    }
} catch (error) {
    console.error(error);
}
})
// display the list of the problem
app.get("/problems",async(req,res)=>{
    try{
        const problems=await Problem.find({});
        res.status(200).json({problems});
    }
    catch(error){
        console.error(error);
    }
})
// problems page
app.get("/currentproblem/:pid",async(req,res)=>{
    try{
        const problem=await Problem.findById(req.params.pid);
        if(!problem){
            res.status(203).json({msg:"Problem Not found!"});
        }
        res.status(200).json({problem});
    }
    catch(error){
        console.error(error);
    }
})

app.get("/submissions",async(req,res)=>{
    const submissions=await Submission.find({});
    return res.status(200).json({submissions:submissions});

})
app.post("/addoa",async(req,res)=>{
    try {
        const {company,noOfQues,timeDuration,givenBy,questionIds}=req.body;
        if(company=="" || noOfQues=="" || timeDuration=="" || givenBy=="" || questionIds==""){
            return res.status(400).json({message:"Some feilds are empty!"});
        }
        const questions=questionIds.split(",");
        const quesDetail=questions;
       
        const oaproblemset=await OaPractice.create({company,noOfQues,timeDuration,givenBy,quesDetail})
        if(oaproblemset){
            return res.status(200).json({message:"Successfull",quesDetail});
        }
    } catch (error) {
        console.error(error);
    }
})
app.get("/oa",async(req,res)=>{
    const oa=await OaPractice.find({});
    if(oa){
        return res.status(200).json({oa});
    }
    
})
app.get("/currentoa/:oaid",async(req,res)=>{
    try {
        const oa=await OaPractice.findById(req.params.oaid);
        if(!oa){
            return res.status(400).json({message:"Oa not found!"});
        }
       
       const oaProblems = await Promise.all(oa.quesDetail.map( async(e) => {
        const problem = await Problem.findById(e);
        if (problem) {
            return problem;
        }
    }));
    res.status(200).json({oaProblems});

    } catch (error) {
        console.error(error);
    }
})
app.get("/health", async (req, res) => {
    res.send({ message: "health OK!" });
  });
app.listen(3000,()=>{
    console.log(" Server is listening on port 3000");
})