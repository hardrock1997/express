const express = require("express")
const {getAllRecipes, postController, deleteController, singleRecipeController} = require("../controllers/recipeController")

const recipeRouter  =  express.Router()


recipeRouter.route("/").get(getAllRecipes).post(postController).delete(deleteController)
recipeRouter.route("/:recipeId").get(singleRecipeController)

module.exports = recipeRouter