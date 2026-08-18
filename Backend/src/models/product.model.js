import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type:Number,
        required: true,
    },
    category: {
        type: String,
        enum: [
            "Book",
            "Electronics",
            "Lab Equipment",
            "Notes",
            "Stationery",
            "Other"
        ]
    },
    images: [{
        type: String
    }],

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    condition: {
        type: String,
        enum: ["New", "Like New", "Good", "Fair"],
        default: "Good"
    },
    isSold: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const productModel = mongoose.model("product", productSchema)

export default productModel;