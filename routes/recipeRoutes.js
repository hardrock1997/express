const express = require("express")
const {getAllRecipes, postController, deleteController, singleRecipeController, updateRecipePut, listRecipes} = require("../controllers/recipeController")

const recipeRouter  =  express.Router()


recipeRouter.route("/").get(getAllRecipes).post(postController).delete(deleteController)
recipeRouter.route("/list").get(listRecipes)
recipeRouter.route("/:recipeId").get(singleRecipeController).put(updateRecipePut)

module.exports = recipeRouter