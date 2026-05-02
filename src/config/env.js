const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const getEnv = () => {
  const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 3000,
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  };

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`${envVar} is not defined in environment variables.`);
    }
  });

  return env;
};

module.exports = getEnv;
