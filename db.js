const mongoose = require("mongoose");
const config = require("config");

//gets password
const db = config.get("MONGO_URI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Mongo has been connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1); //exits the process upon failure
  }
};

module.exports = connectDB;
