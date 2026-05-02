const mongoose = require("mongoose");
const getEnv = require("./env");

const connectDatabase = async () => {
  const env = getEnv();
  await mongoose.connect(env.mongodbUri);
};

module.exports = connectDatabase;
