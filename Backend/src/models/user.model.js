import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:[true,"email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    collageName:{
        type:String,
        default:"",
        trim:true
    },
    department:{
        type:String,
        enum:[
        "CSE",
        "IT",
        "ECE",
        "EEE",
        "Mechanical",
        "Civil",
        "MBA",
        "BCA",
        "MCA",
        "Other",
        ]

    },
    semester:{
        type:String,
        required:true,
        min: 1,
        max: 8,
    },
    phone:{
        type:String,
        default:""
    },
    avatar:{
        type:String,
        default:""
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:"user"
    }
},{timestamps:true})

const userModel = mongoose.model("user",userSchema)

export default userModel;