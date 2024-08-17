import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req,res) => {
    try{
        const {fullname, email, phoneNumber, password, role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message:"Something is missin",
                success: false
            });
        };
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:"Uesr already exista with this email",
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 15);

        await user.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
        })
    }
    catch (error){

    }
}

export const login = async (req,res) =>{
    try{
        const {email, password, role} = req.body;
    }
}