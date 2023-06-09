// Fruit app

const express = require("express");

const app = express();

//include the method-override package place this where you instructor places it
const methodOverride = require("method-override");
//...
//after app has been defined
//use methodOverride.  We'll be adding a query parameter to our delete form named _method

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

app.use(methodOverride("_method"));

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

app.delete("/fruits/:id", (req, res) => {
  Fruit.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("/fruits"); //redirect back to fruits index
  });
});

app.put("/fruits/:id", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  Fruit.findByIdAndUpdate(req.params.id, req.body, (err, updatedFruit) => {
    console.log(updatedFruit);
    res.redirect(`/fruits/${req.params.id}`);
  });
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
    res.redirect("/fruits");
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

// edit
app.get("/fruits/:id/edit", (req, res) => {
  Fruit.findById(req.params.id, (err, foundFruit) => {
    //find the fruit
    if (!err) {
      res.render("../views/fruits/Edit", {
        fruit: foundFruit, //pass in the found fruit so we can prefill the form
      });
    } else {
      res.send({ msg: err.message });
    }
  });
});

// show
app.get("/fruits/:id", (req, res) => {
  Fruit.findById(req.params.id, (err, foundFruit) => {
    res.render("../views/fruits/Show", {
      fruit: foundFruit,
    });
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
