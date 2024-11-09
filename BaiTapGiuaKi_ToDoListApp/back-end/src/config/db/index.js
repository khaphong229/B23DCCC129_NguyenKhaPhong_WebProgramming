const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://root:123@cluster0.zwdmz.mongodb.net/todoapp?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connect successfully");
  } catch (error) {
    console.log("Connect failure");
  }
}

module.exports = { connect };
