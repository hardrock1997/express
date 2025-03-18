require("dotenv").config()
const express = require("express");
const morgan = require("morgan")
require("./config/db")

const recipeRouter = require("./routes/recipeRoutes")

const app = express();

app.use(express.json());

app.use(morgan("dev"))

app.use("/recipes",recipeRouter)

app.listen(1900, () => {
  console.log("App started...............");
});
