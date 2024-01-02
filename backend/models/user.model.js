const Mongoose = require('mongoose')

const userSchema = new Mongoose.Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    avatar:{type:String, default:"https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?size=626&ext=jpg&ga=GA1.1.983458495.1698482536&semt=ais"}
}, {timestamps:true})

module.exports = Mongoose.model('User', userSchema)