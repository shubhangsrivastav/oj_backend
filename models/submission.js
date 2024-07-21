const mongoose=require("mongoose");
const submissionSchema=new mongoose.Schema({

    userName:{
        type:String,
        required:true,
    },

    problemTitle:{
    type:String,
    required:true,
    },

    timeOfSubmission:{
        type:String,
        required:true,
    },
    verdict:{
        type:String,
        required:true,
        
    },
    

})
module.exports=mongoose.model('Submission',submissionSchema);