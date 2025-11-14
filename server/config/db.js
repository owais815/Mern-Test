const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = (mongoose) => {
  try {
    const dbUrl = process.env.DATABASE || "mongodb://localhost:27017/ecommerce";
    mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Database Not Connected");
  }
}