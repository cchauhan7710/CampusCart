import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email required"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"user is required"]
    },
    otpHash:{
        type:String,
        required:[true,"OTP is required"],

    }
},{timestamps:true})

const otpModel = mongoose.model("otp",otpSchema)

export default otpModel;