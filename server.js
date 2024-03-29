const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

if (process.env.NODE_ENV == "development") {
  const swaggerUI = require("swagger-ui-express");
  const swaggerJsDoc = require("swagger-jsdoc");
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "WizeWallet Backend API's",
        version: "1.0.0",
        description: "Express Library API's",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      servers: [
        { url: "https://wizewallet-backend.herokuapp.com/" },
        { url: "http://localhost:" + process.env.PORT },
      ],
    },
    apis: ["./routes/*.js"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(bodyParser.json());

mongoose.connect(
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/WizeWallet-DB",
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.on("error", (error) => {
  console.error(error);
});
db.once("open", () => {
  console.log("Connected to Mongo Succesfully!");
});

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const taskRouter = require("./routes/task_routes");
app.use("/task", taskRouter);

const childTransRouter = require("./routes/child_routes");
app.use("/child", childTransRouter);

const authRouter = require("./routes/auth_routes");
app.use("/auth", authRouter);

const linkRouter = require("./routes/link_routes");
app.use("/link", linkRouter);

const requestRouter = require("./routes/request_routes");
app.use("/request", requestRouter);

module.exports = app;
