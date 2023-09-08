//import needed packages and modules
// const { sumTwo, timesTwo } = require('./modules.js');
const express = require("express");
const dotenv = require("dotenv").config();
const { router } = require("./routes/productRoutes");
const com = require("./utils/connectDB");
const app = express();
const cors = require("cors");
let origin = ["http://localhost:3000"];
const path = require("path");

//middleware
app.use(cors({ credentials: true, origin }));
app.use(express.json()); // accept json files from front end
app.use(express.urlencoded({ extended: true })); //accept form-data from front-end ui
app.use("/api/ecommerce", router);
//routes

//start server

//>>>>>>>>>>>>>deployment>>>>>>>>>>>>>>
app.use(express.static(path.join(__dirname, "/client/build")));

//>>>>>>>>>serve react index.html each time there is a get request>>>>>>>>>>>

app.get("*", (req, res) => {
  res.send(path.join(__dirname, "/client/build", "index.html"));
});

com(() => {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`listening to request on port ${process.env.PORT}`);
  });
});
// console.log(sumTwo(5,9));
// console.log(timesTwo(5,7));
