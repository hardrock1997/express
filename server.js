const express = require("express");
const morgan = require("morgan")

const recipeRouter = require("./routes/recipeRoutes")

const app = express();

app.use(express.json());

app.use(morgan("dev"))

app.use("/recipes",recipeRouter)

/**
 * Todo: 
 * Implement put api
 * Implement patch api
 */

app.listen(1900, () => {
  console.log("App started...............");
});
