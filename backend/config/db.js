const mongoose = require("mongoose");

// This is how we can connect with MongoDB database
const connectDB = async () => {
  try {
    //console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error : ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
//tanishqkhandelwal18072002
