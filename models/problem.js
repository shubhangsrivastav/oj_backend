const mongoose=require("mongoose")

const problemSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true, 
    },
    description:{
        type:String,
        required:true,
    },
    input:{
        type:String,
        required:true,
    },
    output:{
        type:String,
        required:true,
    },
    difficulty:{
        type:String,
        required:true,
    },
    shortdes:{
        type:String,
        required:true,
    },
    submissions:{
        type:Number,
        required:true,
    },
    exampleInput:{
        type:String,
        required:true,
    },
    exampleOutput:{
        type:String,
        required:true,
    },
    testCaseInput:{
        type:String,
        required:true,
    },
    testCaseOutput:{
        type:String,
        required:true,
    },



})
module.exports=mongoose.model('Problem',problemSchema);