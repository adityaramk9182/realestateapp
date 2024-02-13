const User = require('../models/user.model');
const { errorHandler } = require('../utills/error');
const bcryptjs = require('bcryptjs')

const updateUserProfile = async(req, res, next) => {
    console.log(req.user)
    if(req.user.id !== req.params.id) return next(errorHandler(401,'Error:INVALID USER'));
    try{
        let {username, email, password, avatar} = req.body;

        if(password){
            password = bcryptjs.hashSync(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username,
                email,
                password,
                avatar
            }
        }, {new:true});

        const {password:pass, ...rest} = updatedUser._doc;
        res.status(200).json({message:'Profile Updated Successfully', user:rest});
    }catch(err){
        next(err )
    }
}

const deleteUser = async(req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler('400', 'Error:INVALID USER'));
    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token");
        res.status(200).json({message:"User Deleted"});
    }catch(err){
        next(err);
    }
}

module.exports = {updateUserProfile, deleteUser}