require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");
const getEnv = require("./config/env");

const startServer = async () => {
  try {
    const env = getEnv();
    await connectDatabase();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
