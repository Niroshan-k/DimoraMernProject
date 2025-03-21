import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
    try {
        const posting = await Post.create(req.body);
        return res.status(201).json(listing);
    } catch(error){
        next(error);
    }
}

export const getPost = async (req, res, next) => {
    try {
        const posting = await Post.findById(req.params.id);

        if(!posting) {
            return next(errorHandler(404, 'Post not found'));
        }
        res.status(200).json(posting);
    } catch (error) {
        next(error);
    }
}