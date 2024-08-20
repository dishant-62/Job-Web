import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
// import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: "Uesr already exista with this email",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 15);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            })
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorret  email",
                success: false,
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect Password",
                success: false,
            })
        };
        //checking roles?
        if (role != user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role",
                success: false,
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            success: true,
        });

    }
    catch (error) {
        console.log(error);
    }
}

export const logout = async (req,res) => {
    try{
        return res.status(200).cookie("cookie","", {maxAge:0}).json({
            message:"Logged Out successfully",
            success: true,
        });
    }
    catch(error){
        console.log(error);
    }
}

