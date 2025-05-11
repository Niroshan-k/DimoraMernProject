import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        address:{
            type: String,
            required: true,
        },
        price:{
            type: Number,
            required: true,
        },
        bathrooms:{
            type: Number,
            required: true,
        },
        bedrooms:{
            type: Number,
            required: true,
        },
        area:{
            type: Number,
            required: true,
        },
        furnished:{
            type: Boolean,
            required: true,
        },
        parking:{
            type: Boolean,
            required: true,
        },
        property_type:{
            type: String,
            default: "house",
        },
        type:{
            type: String,
            required: true,
        },
        imageUrls:{
            type: Array,
            required: true,
        },
        userRef:{
            type: String,
            required: true,
        },
        packages:{
            type: String
        },
        urgent: {
            type : Boolean,
            default: false
        },
        sold: {
            type : Boolean,
            default: false
        },
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        likedBy: { 
            type: [String], 
            default: [] 
        }
    }, {timestamps: true}
)

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;