const jwt = require('jsonwebtoken');
const {errorHandler} = require('./error')

const verifyUser = (req, res, next) => {
        const token = req.cookies.access_token;

        if(!token) throw new Error(errorHandler(401, 'UNAUTHORISED'));

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)=>{
            if(err) return next(errorHandler(400, "FORBIDDEN"));

            req.user = user;
            next();
        })
}

module.exports = {verifyUser}