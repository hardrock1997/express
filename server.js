const express = require("express");

const recipeRouter = require("./routes/recipeRoutes")

const app = express();

app.use(express.json());

app.use("/recipes",recipeRouter)

/**
 * Todo: 
 * Implement put api
 * Implement patch api
 */

app.listen(1900, () => {
  console.log("App started...............");
});
