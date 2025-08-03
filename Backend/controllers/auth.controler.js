import genToken from "../config/token.js"
import User from "../models/userModel.js"
import bcrypt from "bcryptjs"


export const signUp = async (req, res)=>{
    try {
        const {name,email,password} = req.body
        const existEmail= await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message:"email already exists. try another email"})
        }

        if(password.length<6){
             return res.status(400).json({message:"Password must be at least 6 characters"})
        }

        const hashedPassword = await bcrypt.hash(password,10)
        
        const user = await User.create({
            name,password:hashedPassword,email
        })

        const token = await genToken(user._id)

        res.cookie("token",token,
            {
            httpOnly:true,
            maxAge:15*24*60*60*1000,
            sameSite:"strict",
            secure:false
        })

        return res.status(201).json(user)


    } catch (error) {
        return res.status(500).json({message:`sign up error ${error}`})
        console.log(error);
    }
}





export const Login = async (req, res)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user dose not exists. try again"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
             return res.status(400).json({message:"Password incorrect. try again"})
        }

        const token = await genToken(user._id)

        res.cookie("token",token,
            {
            httpOnly:true,
            maxAge:15*24*60*60*1000,
            sameSite:"strict",
            secure:false
        })

        return res.status(200).json(user)


    } catch (error) {
        return res.status(500).json({message:`Login error ${error}`})
        console.log(error);
    }
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token")
          return res.status(200).json({message: "Logout successfully"})
    } catch (error) {
        console.log(error)
    }
}