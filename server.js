// Fruit app

const express = require("express");

const app = express();

const port = 3000;
const mongoose = require("mongoose");

// Add dotnv
require("dotenv").config();

// Mongose info

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

// Middleware

app.use((req, res, next) => {
  console.log("I run for all routes");
  next();
});

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "jsx");
app.engine("jsx", require("jsx-view-engine").createEngine());

// Data
const Fruit = require("./models/fruits.js");
const vegetables = require("./models/vegetables.js");

// Routes

//put this above your Show route

// app.get("/fruits", function (req, res) {
//   res.render("../views/fruits/Index", { fruits: Fruit });
// });
app.get("/fruits", (req, res) => {
  Fruit.find({}, (error, allFruits) => {
    res.render("fruits/Index", {
      fruits: allFruits,
    });
  });
});
app.get("/vegetables", function (req, res) {
  res.render("vegetables/Index", { vegetables: vegetables });
});

app.get("/fruits/new", (req, res) => {
  res.render("../views/fruits/New");
});

app.get("/vegetables/new", (req, res) => {
  res.render("../views/vegetables/New");
});

app.post("/fruits", (req, res) => {
  if (req.body.readyToEat === "on") {
    //if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true;
  } else {
    //if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false;
  }
  Fruit.create(req.body, (error, createdFruit) => {
    res.redirect('/fruits');
  });
});

app.post("/vegetables", (req, res) => {
  if (req.body.readyToEat === "on") {
    //if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true;
  } else {
    //if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false;
  }
  vegetables.push(req.body);
  res.redirect("/vegetables");
});

app.get("/fruits/:indexOfFruitsArray", function (req, res) {
  res.render("fruits/Show", {
    //second param must be an object
    fruit: Fruit[req.params.indexOfFruitsArray], //there will be a variable available inside the ejs file called fruit, its value is fruits[req.params.indexOfFruitsArray]
  });
});

app.get("/vegetables/:indexOfVegetablesArray", function (req, res) {
  res.render("vegetables/Show", {
    //second param must be an object
    vegetable: vegetables[req.params.indexOfVegetablesArray], //there will be a variable available inside the ejs file called fruit, its value is fruits[req.params.indexOfFruitsArray]
  });
});

app.listen(port, () => {
  console.log(`Listening on port, ${port}`);
});
