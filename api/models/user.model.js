import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default : "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
    },
    phone: {
        type: String,
        default: null
    },
    location: {
        type: String,
        default: null
    },
    verified: {
        type: String,
        default: "false"
    },
    verifiedFormData : {
        type: Array,
    }
},{ timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;