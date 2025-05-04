import mongoose from "mongoose";

const SecuritySchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true }, // Only for admin review
        //ip: { type: String, required: true },
        reason: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("Security", SecuritySchema);