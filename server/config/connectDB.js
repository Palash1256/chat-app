const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB Connected");
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log("Somthing is wrong in MongoDB", err);
  }
}

module.exports = connectDB;
