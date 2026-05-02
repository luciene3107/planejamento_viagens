const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const routes = require("./routes");
const { errorHandler } = require("./middleware/error.middleware");
const getEnv = require("./config/env");

const swaggerDocument = YAML.load(path.join(__dirname, "docs", "swagger.yaml"));
const env = getEnv();

swaggerDocument.servers = [{ url: env.baseUrl }];

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
