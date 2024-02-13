const express = require('express')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const AuthRoutes = require('./routes/auth.route')
const UserRoutes = require('./routes/user.route')
const ListingRoutes = require('./routes/listing.route')

const app = express()

dotEnv.config();

app.use(express.json())
app.use(cookieParser());

const ServerPort = process.env.PORT ? process.env.PORT : 5000;

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('MONGO DB connected sucessfully')
}).catch((err)=>{
    console.log(err)
})

app.use('/api/v1/auth', AuthRoutes)
app.use('/api/v1/user', UserRoutes)
app.use('/api/v1/listing', ListingRoutes)

//middleware for error handeling
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Error:Internal Server Message";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})

app.listen(ServerPort, ()=>{
    console.log(`Server started on port : ${ServerPort}`)
})