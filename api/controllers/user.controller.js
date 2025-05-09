import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from "../models/listing.model.js";
import Post from '../models/post.model.js';

export const test = (req, res) => {
    res.json({
        message: 'hello from controller',
    });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "you can only update your own account."));
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
                phone: req.body.phone,
                location: req.body.location,
                verified: req.body.verified,
                description: req.body.description,
            }
        }, { new: true });

        const { password, ...rest } = await updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "you can only delete your own account."));
    try {
        await User.findByIdAndDelete(req.params.id);
        //res.clearCookie('access_token');
        res.status(200).json("Account has been deleted.");
    } catch (error) {
        next(error);
    }
}

export const deleteUserAdmin = async (req, res, next) => {
    console.log("req.user:", req.user); // Debugging: Log the req.user object

    if (!req.user || req.user.role !== 'admin') {
        console.log("Role is not admin. Current role:", req.user ? req.user.role : "undefined"); // Log the role
        return next(errorHandler(401, `Not admin`));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Account has been deleted." });
    } catch (error) {
        next(error);
    }
};

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listing = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listing);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, "you can only view your own listings."));
    }

}

export const getSellerInfo = async ( req, res, next) => {
    try {
        const seller = await User.findById(req.params.id);

        if(!seller) {
            return next(errorHandler(404, 'Listing not found'));
        }
        res.status(200).json(seller);
    } catch (error) {
        next(error);
    }
}

export const getUserPosts = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const posts = await Post.find({ userRef: req.params.id });
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, "you can only view your own posts."));
    }

}

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const getUserInfo = async ( req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

export const getUserListingsAdmin = async (req, res, next) => {
    if (req.params.id) {
        try {
            const listing = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listing);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, "you can only view your own listings."));
    }

}

export const getUserPostsAdmin = async (req, res, next) => {
    if (req.params.id) {
        try {
            const posts = await Post.find({ userRef: req.params.id });
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(401, "you can only view your own posts."));
    }

}

export const createForm = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            // Log incoming data for debugging
            console.log("Incoming Form Data:", req.body.form);

            // Update the user with the verified form data
            const form = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        verified: "verifying", // Set verified to true
                        verifiedFormData: req.body.form, // Update the verifiedFormData field
                    },
                },
                { new: true } // Return the updated document
            );

            // Log the updated user record
            console.log("Updated User Record:", form);

            // Send a response to the client
            res.status(200).json(form);
        } catch (error) {
            console.error("Error in createForm:", error); // Log the error
            next(error);
        }
    } else {
        console.error("Authorization failed."); // Log unauthorized access
        return next(errorHandler(401, "You're not authorized."));
    }
};

export const UserVerified = async (req, res, next) => {
    if (req.user.role === "admin") {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        verified: req.body.verified, // Set verified field
                    },
                },
                { new: true } // Return the updated document
            );
            res.status(200).json(user);
        } catch (error) {
            console.error("Error in UserVerified:", error); // Log the error
            next(error);
        }
    } else {
        console.error("Authorization failed."); // Log unauthorized access
        return next(errorHandler(401, "You're not authorized."));
    }
};


