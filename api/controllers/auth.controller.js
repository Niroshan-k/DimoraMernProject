import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        const hashedPassword = bcryptjs.hashSync(password, 10);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword, 
            role
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully" });

    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { username,email, password, role } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found!'));
        }
        if (validUser.role !== role) {
            return next(errorHandler(401, 'Incorrect role selection!'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

        const token = jwt.sign(
            { id: validUser._id, role: validUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('access_token', token, {
            httpOnly: true
        }).status(200).json({
            success: true,
            message: "Login successful!",
            username: validUser.username,
            _id: validUser._id, // 🔹 Now directly accessible as `currentUser._id`
            email: validUser.email,
            role: validUser.role
        });
    } catch (error) {
        next(error);
    }
};


export const google = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            // Check if the role matches
            if (user.role !== req.body.role) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Incorrect role selection!"
                });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
            const { password: pass, ...userData } = user._doc;

            return res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json({ success: true, ...userData });
        } else {
            // If user does not exist, require role selection
            if (!req.body.role) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Role is required." 
                });
            }

            // Generate a random password and hash it
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            // Create a new user
            const newUser = new User({ 
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), 
                email: req.body.email, 
                password: hashedPassword,
                role: req.body.role, 
                avatar: req.body.photo 
            });

            await newUser.save();
            
            // Generate JWT token for new user
            const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET);
            const { password: pass, ...userData } = newUser._doc;

            return res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json({ success: true, ...userData });
        }
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

export const signOut = async (req, res, next)=> {
try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out');
} catch (error) {
    next(error)
}
}

