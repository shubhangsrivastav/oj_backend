const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

const DBconnections = async()=>{
    const MONGODB_URL=process.env.MONGODB_URI;
    try {
        await mongoose.connect(MONGODB_URL,{useNewUrlParser:true});
        console.log("DB connection Established");
    } catch (error) {
        console.error(error);
    }
};

module.exports={DBconnections};
