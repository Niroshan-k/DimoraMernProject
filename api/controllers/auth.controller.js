import User from "../models/user.model.js";
import Security from "../models/Security.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
            });
        }

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
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const signin = async (req, res, next) => {
    const { email, password, role } = req.body;

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, 'User not found!'));
        }

        // Check if the user is temporarily locked out
        const lockoutDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
        const failedAttemptWindow = 2 * 60 * 1000; // 2 minutes in milliseconds
        const currentTime = Date.now();

        if (validUser.isLocked && currentTime < validUser.lockUntil) {
            const remainingTime = Math.ceil((validUser.lockUntil - currentTime) / 60000); // Calculate remaining time in minutes
            return next(errorHandler(403, `Account is temporarily locked. Try again in ${remainingTime} minutes.`));
        }

        // If lockout period has passed, reset lock and failed attempts
        if (validUser.isLocked && currentTime >= validUser.lockUntil) {
            validUser.isLocked = false;
            validUser.failedLoginAttempts = 0;
            await validUser.save();
        }

        // Validate role
        if (validUser.role !== role) {
            return next(errorHandler(401, 'Incorrect role selection!'));
        }

        // Validate password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            validUser.failedLoginAttempts += 1;

            // Check if the user has reached the failed attempts threshold
            if (validUser.failedLoginAttempts >= 3) {
                validUser.isLocked = true;
                validUser.lockUntil = currentTime + lockoutDuration; // Lock user for 10 minutes
                await validUser.save();
                return next(errorHandler(403, `Account is temporarily locked due to too many failed login attempts. Try again in 10 minutes.`));
            }

            await validUser.save();
            return next(errorHandler(401, 'Wrong credentials!'));
        }

        // Reset failed login attempts on successful login
        validUser.failedLoginAttempts = 0;
        validUser.isLocked = false;
        validUser.lockUntil = undefined;
        validUser.loggedIn = "logedin";
        await validUser.save();

        // Generate JWT Token
        const token = jwt.sign(
            { id: validUser._id, role: validUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Exclude sensitive fields like password
        const { password: pass, ...userData } = validUser._doc;

        res.cookie('access_token', token, {
            httpOnly: true,
        }).status(200).json({
            success: true,
            ...userData, // Include all user data except the password
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

            // Update the loggedIn status to "logedin"
            user.loggedIn = "logedin";
            await user.save();

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
                avatar: req.body.photo,
                loggedIn: "logedin" 
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
        const { email } = req.body;
        // Update the loggedIn status to "logout"
        await User.findOneAndUpdate(
            { email },
            { loggedIn: "logout" },
            { new: true }
        );
        
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out');
    } catch (error) {
        next(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const securityAlerts = async (req, res, next) => {
    try {
        const { email, password, reason } = req.body;

        const newSecurityAlert = new Security({
            email,
            password, 
            reason
        });

        await newSecurityAlert.save();
        res.status(201).json({ success: true, message: "security alert successfully saved" });

    } catch (error) {
        next(error);
    }
}

export const getAlerts = async (req, res, next) => {
    try {
        const alerts = await Security.find({});
        res.status(200).json(alerts);
    } catch (error) {
        next(error);
    }
}

