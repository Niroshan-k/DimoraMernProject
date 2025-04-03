import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
    try {
        const posting = await Post.create(req.body);
        return res.status(201).json(posting);
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

export const updatePost = async (req, res, next) => {
    const posting = await Post.findById(req.params.id);
    if (!posting) {
        return next(errorHandler(404, 'Post not found'));
    }

    if (!req.user || req.user.id !== posting.userRef) {
        return next(errorHandler(401, 'You are not authorized to update this post'));
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};