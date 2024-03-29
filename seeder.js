const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env vars
dotenv.config({path: './config/config.env'});

//load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/course')
//connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
});

//read json files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

//import into DB
const importData = async () =>{
    try {
        await Bootcamp.create(bootcamps); //create a new object with the specified prototype object and properties.
        await Course.create(courses);
        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

//delete data
const deleteData = async () =>{
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
}

if (process.argv[2] === '-i'){
    importData(); //harus deklarasi variabel dulu
} else if (process.argv[2] === '-d') {
    deleteData();
}

//node seeder -i / -d