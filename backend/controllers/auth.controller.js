
const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {errorHandler} = require('../utills/error')

const userSignUp = async(req, res, next) => {
    try{
        const {username, email, password} = req.body;

        if(!username || !email || !password){
            throw new Error('All fields are mandatory!')
        }
        
        const hashedPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            username,
            email,
            password:hashedPassword
        })

        await newUser.save();
        res.status(201).json({message:'User Created Sucessfully'});
    }catch(err){
        next(err)
    }
}

const userSignIn = async(req, res, next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) return next(errorHandler(400, 'All fields are mandatory'))

        const existedUser = await User.findOne({email});
        if(!existedUser) return next(errorHandler(404, 'USER NOT FOUND'))

        const validPassword = bcryptjs.compareSync(password, existedUser.password);
        if(!validPassword) return next(errorHandler(401, "INVALID PASSWORD"))

        const token = jwt.sign({id:existedUser._id}, process.env.JWT_SECRET_KEY);

        const {password:pass, ...rest} = existedUser._doc;

        res.cookie('access_token', token, {httpOnly:true}).status(200).json({message:'Authentication Successfull', user:rest})
    }catch(err){
        next(err)
    }
}

const googleSignIn = async(req, res, next) => {
    try{
        const {name, email, avatar} = req.body; 
        const findUser = await User.findOne({email:email});
        if(findUser){
            const token = jwt.sign({id:findUser._id}, process.env.JWT_SECRET_KEY);
            const {password:pass, ...rest} = findUser._doc;
            res.cookie('token_id', token, {httpOnly:true}).status(200).json({message:'Authentication Successfull', user:rest})
        }else{
            const generatePassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
            const hashGeneratedPassword = bcryptjs.hashSync(generatePassword, 10);
            const generateUsername  = name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4);
            const newUser = new User({username:generateUsername, email, password:hashGeneratedPassword, avatar});
            await newUser.save();
            const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET_KEY);
            const {password:pass, ...rest} = newUser._doc;
            res.cookie('token_id', token, {httpOnly:true}).status(200).json({message:'Authentication Successfull', user:rest})
        }
    }catch(err){
        next(err)
    }
}

module.exports = {userSignUp, userSignIn, googleSignIn}