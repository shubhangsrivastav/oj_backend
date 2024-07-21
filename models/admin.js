const mongoose =require('mongoose');    

const adminSchema=new mongoose.Schema({

    userName:{
        type:String,
        required:true,
    },

    firstName:{
    type:String,
    required:true,
    },

    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true
    }

//schema

})

module.exports=mongoose.model('Admin',adminSchema)