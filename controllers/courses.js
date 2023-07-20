const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Course = require('../models/course')

// @desc    Get courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public 
exports.getCourses=asyncHandler(async(req,res,next)=> {
    let query;

    if(req.params.btcmpId){
        query = Course.find({bootcamp:req.params.btcmpId})
    } else {
        query = Course.find().populate({
            path:'bootcamp',
            select:'name description'
        }); // nothing passed in 
    }

    const courses = await query;
    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses 
    })

});

//note :
//1a. req.params.btcmpId yg dimaksud adalah :btcmpId di file ../routes/bootcamps.js
//1b. btcmpId itu bisa diubah namanya (kita yg nentukan)
