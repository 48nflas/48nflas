//import modul-modul yang dibutuhkan
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const lg = require('./middleware/logger')
const colors = require('colors')
const errorHandler=require('./middleware/error')
const connectDB = require('./config/db')
const http = require('http')
//load env vars
dotenv.config({ path: './config/config.env'});

//connect to database
connectDB();

//import route files
const btcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

//Body parser
app.use(express.json());

if (process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}
//mount routers
app.use('/api/v1/bootcamps', btcamps); //bootcamps : 
app.use('/api/v1/courses', courses);
app.use(lg);
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`);
    //close server and exit process
    server.close(() => process.exit(1))
});

//NOTES!!

//query parameter = ? - menyatakan kriteria
// lt : akronim dari less than
// lte : less than / equal to 
// gt : greater than
// gte : greater than or equal to 

//formula umum model mongoose :
//variabel : {[spesifikasi] (type : ..., required (dibutuhkan apa tdk) : ..., maxlength : [n, 'some string' (tereksekusi jika pjg lebih dari n)], unique, trim, min, max, dll)}
