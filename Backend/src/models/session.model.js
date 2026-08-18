import mongoose from "mongoose";

const sessionShema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,"user is required "]
    },
    refreshTokenHash:{
        type:String,
        required:[true,"refreshTokenHash is required"]
    },
    ip:{
        type:String,
        required:[true,"ip address is required"]
    },
    userAgent:{
        type:String,
        required:[true,"user agent is required"]
    },
    revoked:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const sessionModel = mongoose.model("session",sessionShema)

export default sessionModel;