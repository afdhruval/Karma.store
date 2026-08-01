import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

// Cookie options — sameSite=None + secure required for cross-site cookies
// between Vercel (frontend) and Render (backend) in production
const isProduction = config.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,                              // Prevent XSS access to cookie
    secure: isProduction,                        // Only send over HTTPS in production
    sameSite: isProduction ? "None" : "Lax",    // None required for cross-site; Lax fine for dev
    maxAge: 7 * 24 * 60 * 60 * 1000,           // 7 days in milliseconds
};


async function sendTokenResponse(user, res, message) {

    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token, cookieOptions)

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })

}


export const register = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body;

    try {
        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or contact already exists" });
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"
        })

        await sendTokenResponse(user, res, "User registered successfully")

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    await sendTokenResponse(user, res, "User logged in successfully")
}

export const googleCallback = async (req, res) => {
    try {
        if (!req.user) {
            const frontendUrl = isProduction ? "https://karmastore-iota.vercel.app" : "http://localhost:5173";
            return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
        }

        const { id, displayName, emails, photos } = req.user;
        const email = emails?.[0]?.value;

        if (!email) {
            const frontendUrl = isProduction ? "https://karmastore-iota.vercel.app" : "http://localhost:5173";
            return res.redirect(`${frontendUrl}/login?error=no_email`);
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                email,
                googleId: id,
                fullname: displayName || "Google User",
            });
        } else if (!user.googleId) {
            user.googleId = id;
            await user.save();
        }

        const token = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("token", token, cookieOptions);

        // Dynamically redirect back to the starting frontend origin from Google state parameter
        const frontendOrigin = req.query.state || (isProduction ? "https://karmastore-iota.vercel.app" : "http://localhost:5173");
        const redirectUrl = frontendOrigin.endsWith('/') ? frontendOrigin : `${frontendOrigin}/`;
        return res.redirect(redirectUrl);
    } catch (error) {
        console.error("googleCallback error:", error);
        const frontendUrl = isProduction ? "https://karmastore-iota.vercel.app" : "http://localhost:5173";
        return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
}

export const getMe = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}

export const logout = async (req, res) => {
    // clearCookie options must match the options used when setting the cookie
    res.clearCookie("token", {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
    });
    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
}