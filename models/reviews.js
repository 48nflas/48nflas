// make reviews model
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true, 'Please add a title']
    },
    text:{
        type:String,
        required:[true, 'Please add a text']
    },
    rating:{
        type:String,
        required:[true, 'Please add a rating']
    },
    bootcamp:{
        type:mongoose.Schema.objectId,
        ref:'Bootcamp',
        required:true
    },
    user:{
        type:mongoose.Schema.objectId,
        ref:'users',
        required:true
    }
});

module.exports = mongoose.model('reviews',ReviewSchema);