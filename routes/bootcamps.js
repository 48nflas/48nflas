const express = require('express');
const {getBootcamps, getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampsInRadius} = require('../controllers/bootcamps');

//include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// re-route into other resource routers
router.use('/:btcmpId/courses',courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius); //router.route(url yg dituju (dengan parameter (jika ada))).metode

router.route('/').get(getBootcamps).post(createBootcamp); //nama_metode(variabel)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp); //nama_metode(variabel)

module.exports = router
//router : yg diekspor