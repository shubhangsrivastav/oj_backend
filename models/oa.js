const mongoose=require("mongoose")

const oaSchema=new mongoose.Schema({
    company:{
        type:String,
        required:true, 
    },
    noOfQues:{
        type:String,
        required:true,
    },
    timeDuration:{
        type:String,
        required:true,
    },
    givenBy:{
        type:String,
        required:true,
    },
    quesDetail:{
        type:[],
        required:true,
    },
    
})
module.exports=mongoose.model('OaPractice',oaSchema);