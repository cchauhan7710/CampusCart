import mongoose  from "mongoose";
import config from "../config/config.js";
 async function connectDB(req,res)
{
   try {
     const connectingDB = await mongoose.connect(config.MONGO_URI)
     console.log("Database connected SuccessFully !")
   } catch (error) {
    console.error(error.message,"Error while connecting to the database")
    return res.status(500)
    .json({
        message:"Internal server error"
    })
   }
}

export default connectDB;