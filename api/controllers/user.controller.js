import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from "../models/listing.model.js";
import Post from '../models/post.model.js';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

console.log('Speakeasy imported:', speakeasy);

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

// Generate 2FA Secret
export const generate2FASecret = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({
            name: `DimoraRealestate (${req.user.email})`, // App name and user email
        });

        // Save the secret to the user's database record
        const user = await User.findById(req.user.id);
        user.twoFactorSecret = secret.base32; // Save the base32 secret
        await user.save();

        // Generate a QR code for the user to scan
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

        res.status(200).json({
            success: true,
            qrCodeUrl, // Send the QR code URL to the frontend
            secret: secret.base32, // Optional: Send the secret (for testing purposes)
        });
    } catch (error) {
        console.error('Error generating 2FA secret:', error);
        res.status(500).json({ success: false, message: 'Failed to generate 2FA secret.' });
    }
};

// Verify 2FA Code
export const verify2FA = async (req, res) => {
    try {
        const { token } = req.body;

        // Retrieve the user's 2FA secret from the database
        const user = await User.findById(req.user.id);
        if (!user || !user.twoFactorSecret) {
            return res.status(400).json({ success: false, message: '2FA is not enabled for this user.' });
        }

        // Verify the TOTP token
        const isVerified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
        });

        if (!isVerified) {
            return res.status(400).json({ success: false, message: 'Invalid 2FA token.' });
        }

        res.status(200).json({ success: true, message: '2FA verification successful.' });
    } catch (error) {
        console.error('Error verifying 2FA token:', error);
        res.status(500).json({ success: false, message: 'Failed to verify 2FA token.' });
    }
};

// Enable 2FA
export const enable2FA = async (req, res) => {
    try {
        const { token } = req.body;

        // Retrieve the user's 2FA secret from the database
        const user = await User.findById(req.user.id);
        if (!user || !user.twoFactorSecret) {
            return res.status(400).json({ success: false, message: '2FA is not enabled for this user.' });
        }

        // Verify the TOTP token
        const isVerified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
        });

        if (!isVerified) {
            return res.status(400).json({ success: false, message: 'Invalid 2FA token.' });
        }

        // Enable 2FA for the user
        user.isTwoFactorEnabled = true;
        await user.save();

        res.status(200).json({ success: true, message: '2FA has been enabled.' });
    } catch (error) {
        console.error('Error enabling 2FA:', error);
        res.status(500).json({ success: false, message: 'Failed to enable 2FA.' });
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

export async function handleLogin(req, res) {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the password matches (assuming you have a password hashing mechanism)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Update the loggedIn status to "logedin"
        await User.findOneAndUpdate(
            { email }, // Find the user by email
            { loggedIn: "logedin" }, // Update the loggedIn field
            { new: true } // Return the updated document
        );

        // Respond with success
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


