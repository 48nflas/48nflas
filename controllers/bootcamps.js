const Bootcamp = require('../models/Bootcamp'); //mengimpor modul dengan nama file Bootcamp.js
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public

exports.getBootcamps = asyncHandler(async (req,res,next) => {
    //console.log(req.query); //hanya menampilkan query di console 
    //const bootcamps = await Bootcamp.find(req.query); //mencari dan menampilkan semua dokumen (jika () : tanpa kriteria, jika ada parameter dlm () berarti ada kriteria)

    let query;

    //copy req.query
    const reqQuery = {...req.query};

    //fields to exclude
    const removeFields = ['select','sort','page','limit'];

    //loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    console.log(reqQuery);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators ($gt, $gte, etc)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`);

    //Finding resource
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

    //select fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query=query.select(fields)
    }

    //sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        q = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit,10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments(); //byknya semua bootcamp dalam database

    query = query.skip(startIndex).limit(limit);

    //Executing query
    const bootcamps = await query;

    //pagination result
    const pagination = {}; //buat dictionary kosongan
    //pagination.next = berarti bikin subfield - ngisi data baru

    if(endIndex < total) {
        pagination.next = {
            page: page+1,
            limit
        }
    }

    if (startIndex > 0){
        pagination.prev={
            page:page-1,
            limit 
        }
    }
    res.status(200).json({success:true,count:bootcamps.length, pagination, data:bootcamps});
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
//pertimbangkan kemungkinan situasi yg mungkin terjadi, 
exports.getBootcamp = asyncHandler(async (req,res,next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);    

        if(!bootcamp){  
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({success:true,data:bootcamp});
    //} catch(err){
        //res.status(400).json({success:false});
        //next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404)); 
    //    next(err);
    //}        
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private

//option 1
//exports.createBootcamp = (req,res,next) => {
//    console.log(req.body);
//    res.status(200).json({success:true,msg:'Create new bootcamp'});
//};

//option 2
exports.createBootcamp = asyncHandler(async (req,res,next) => {
    //try{
        const bootcamp = await Bootcamp.create(req.body); //

    res.status(201).json({
        success: true,
        data: bootcamp
    });
    // } catch (err){
    //     next(err);
    // }
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private 

exports.updateBootcamp = asyncHandler(async (req,res,next) => {
    //try{ 
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    }); 
    if(!bootcamp){ //jika id yang dicari tidak ada di database
        //return res.status(400).json({success:false});
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    }
    res.status(200).json({success:true,data:bootcamp});

    //} catch (err){
    //    next(err);
    //}
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private

exports.deleteBootcamp = asyncHandler(async (req,res,next) => {
    //try{ 
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        //return res.status(400).json({success:false});
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    } 

    bootcamp.remove;
    res.status(200).json({ success:true, data:{} });

    //} catch (err){
    //    next(err);
    //};
});

// @desc    Get bootcamps within a radius (note : titik, jari-jari)
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance/
// @access  Private

exports.getBootcampsInRadius = asyncHandler(async (req,res,next) => {
    const {zipcode,distance} = req.params;
    //get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calc radius using radians
    // divide dist by radius of Earth
    // Earth radius = 3963 mi / 6378.1 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere:[[lng,lat],radius]}}
    });
    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps
    });
});

