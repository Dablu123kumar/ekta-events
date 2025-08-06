import bcrypt from 'bcrypt'
import User from '../models/userModel.js'


// create user 
export const createUser = async (req,res)=>{
    try {
        const {name,email,password} = req.body 
        if(!name || !email || !password){
            return res.status(400).json({
                message : "Please fill all the fields",
                success : false,
                error : true
            })
        }
        const existUser = await User.findOne({email})
        if(existUser){
             return res.status(400).json({
                message : "user already exists",
                success : false,
                error : true
            })
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await User({name,email,password:hashedPassword})
        await user.save()
        return res.status(201).json({
            message : 'User created successfully',
            success : true,
            error  : false,
            data : user
        })
    } catch (error) {
        return res.status(500).json({ message : error.message})
    }
}

// login user
export const loginUser = async (req,res)=>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({
                message : "Please fill all the fields",
                success : false,
                error : true
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                message : "User not found",
                success : false,
                error : true
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                message : "Invalid credentials",
                success : false,
                error : true
            })
        }
        return res.status(200).json({
            message : "Login successful",
            success : true,
            error : false,
            data:user
        })
    } catch (error) {
        return res.status(500).json({ message : error.message})
    }
}
