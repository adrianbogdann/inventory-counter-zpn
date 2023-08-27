process.env.TZ = "Europe/Athens";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

/* Routes */
const userRouter = require("./app/routes/user");
const productRouter = require("./app/routes/product");
const subProductRouter = require("./app/routes/subProduct");
const countPlanRouter = require("./app/routes/countPlan");
const countExecution = require("./app/routes/countExecution");
const productCountRouter = require("./app/routes/productCount");
const barcodeRouter = require("./app/routes/barcode");

const app = express();

var corsOptions = {
  origin: `http://localhost:${process.env.NODE_LOCAL_PORT}`,
};

app.use(cors(corsOptions));

const db = require("./app/models");
const isAuthorized = require("./app/middleware/check-user-auth");

db.sequelize
  .sync(/*{ force: true }*/)
  .then(() => {
    // if force flag is set, DB is dropped first
    console.log("Synced DB");
  })
  .catch((err) => {
    console.log("Failed to sync DB: " + err.message);
  });

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// TODO: improve routes with prefixes: /countPlan/add, /product/add X
// TODO: parse and clean input X
// TODO: add seeders to DB X
// TODO: add middlewares to routes X
// TODO: add indexes to DB X
// TODO: create route + service for barcodes X
// TODO: comment on each route what it does, receives X
// TODO: make return responses consistent X
// TODO: check comments and remove console.logs X
// TODO: add user endpoint X

// Register routes

// doesn't need middleware, adding product counts is allowed for admins and counters
app.use(productCountRouter);
app.use(userRouter);

// middleware to check admin role
app.use(isAuthorized);

app.use(productRouter);
app.use(subProductRouter);
app.use(barcodeRouter);
app.use(countPlanRouter);
app.use(countExecution);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Adi N's application." });
});

// set port, listen for requests
const PORT = process.env.ENV_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
