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
    },
    failedLoginAttempts: { 
        type: Number, default: 0 
    }, // Track failed login attempts
    isLocked: { 
        type: Boolean, 
        default: false 
    }, // Lock status
    lockUntil: { 
        type: Date 
    },
    description: {
        type: String,
        default: null
    },
    loggedIn : {
        type : String,
        default : "logout"
    },
    isTwoFactorEnabled: { 
        type: Boolean, 
        default: false 
    }, // Indicates if 2FA is enabled
    twoFactorSecret: { 
        type: String, 
        default: null 
    },
    
},{ timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;