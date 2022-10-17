const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const restaurantRouter = require("./routes/restaurant");
const ordersRouter = require("./routes/orders");

const app = express();
app.use(bodyParser.json());

app.use("/restaurant", restaurantRouter);
app.use("/orders", ordersRouter);

app.use((error, req, res, next) => {
  //error handler
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://ian-project1:zMWYCrPUvgQ4v6cH@cluster0.fcbe0.mongodb.net/yammie-restaurant?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
