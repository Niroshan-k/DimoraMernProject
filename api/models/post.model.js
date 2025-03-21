import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
        location:{
            type: String,
            required: true,
        },
        budget:{
            type: Number,
            required: true,
        },
        years:{
            type: Number,
            required: true,
        },
        months:{
            type: Number,
            required: true,
        },
        days:{
            type: Number,
            required: true,
        },
        imageUrls:{
            type: Array,
            required: true,
        },
        userRef:{
            type: String,
            required: true,
        }
    }, {timestamps: true}
)

const Post = mongoose.model('Post', postSchema);

export default Post;