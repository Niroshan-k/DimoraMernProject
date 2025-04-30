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

export const deletePost = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(errorHandler(404, 'Listing not found'));
    }
    
    if (!req.user || req.user.id !== post.userRef) {
        return next(errorHandler(401, 'You are not authorized to delete this listing'));
    }

    try {
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json("Listing deleted successfully");
    } catch (error) {
        next(error);
    }
};

export const deletePostAdmin = async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(errorHandler(404, 'Listing not found'));
    }
    
    if (!req.user || req.user.role !== "admin") {
        console.log("Role is not admin. Current role:", req.user ? req.user.role : "undefined"); // Log the role
        return next(errorHandler(401, 'You are not Admin'));
    }

    try {
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json("Listing deleted successfully");
    } catch (error) {
        next(error);
    }
};

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

export const updateStar = async (req, res) => {
    const { id } = req.params; // Post ID
    const starKey = Object.keys(req.body)[0]; // e.g., "Star3"
    const starValue = req.body[starKey]; // e.g., 5

    try {
        // Update the star value in the database
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { [starKey]: starValue },
            { new: true } // Return the updated document
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: "Post not found." });
        }

        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error("Error updating star value:", error);
        res.status(500).json({ success: false, message: "An error occurred." });
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const startIndex = parseInt(req.query.startIndex) || 0;
        
        const searchTerm = req.query.searchTerm || '';
        const location = req.query.location || '';

        // Ensure sorting is valid
        const validSortFields = ['createdAt', 'price']; // Only allow sorting by these fields
        let sort = req.query.sort || 'createdAt';
        if (!validSortFields.includes(sort)) {
            sort = 'createdAt'; // Default to createdAt if invalid
        }

        // Convert order to MongoDB format (-1 for desc, 1 for asc)
        let order = req.query.order === 'asc' ? 1 : -1;

        const post = await Post.find({
            title: { $regex: searchTerm, $options: 'i' },
            location: {$regex: location, $options: 'i'}
        })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);

        return res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

