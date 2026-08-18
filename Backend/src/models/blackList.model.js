import mongoose from "mongoose";

const tokenBlackList = new mongoose.Schema({
    refreshToken:{
        type:String,
        required:[true,"token required"]
    }
},{timestamps:true})

const blackListModel = mongoose.model("blackListedToken",tokenBlackList)

export default blackListModel;