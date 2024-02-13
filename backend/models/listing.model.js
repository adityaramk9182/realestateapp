const Mongoose = require('mongoose');

const listingSchema = new Mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    normalPrice:{
        type:Number,
        required:true
    },
    discountedPrice:{
        type:Number,
        required:true
    },
    bathRooms:{
        type:Number,
        required:true
    },
    bedRooms:{
        type:Number,
        required:true
    },
    furnished:{
        type:Boolean,
        required:true
    },
    parking:{
        type:Boolean,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    offer:{
        type:Boolean,
        required:true
    },
    imageUrls:{
        type:Array,
        required:true
    },
    userRef:{
        type:String,
        required:true
    }
}, {timestamps:true});

module.exports = Mongoose.model('Listing', listingSchema);