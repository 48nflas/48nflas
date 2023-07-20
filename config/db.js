const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI
    const conn = await mongoose.connect(uri, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    });

    console.log(`MongoDB Connected : ${conn.connection.host}`.blue.underline.bold);
}

module.exports=connectDB;