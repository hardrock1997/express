const express = require("express")
const getAllRecipes = require("../controllers/recipeController")
const postController = require("../controllers/postController")
const deleteController = require("../controllers/deleteController")
const singleRecipeController = require("../controllers/singleRecipeController")

const recipeRouter  =  express.Router()


recipeRouter.route("/").get(getAllRecipes).post(postController).delete(deleteController)
recipeRouter.route("/:recipeId").get(singleRecipeController)

module.exports = recipeRouter