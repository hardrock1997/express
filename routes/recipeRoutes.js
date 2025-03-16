const express = require("express")
const getAllRecipes = require("../controllers/recipeController")
const postController = require("../controllers/postController")
const deleteController = require("../controllers/deleteController")

const recipeRouter  =  express.Router()


recipeRouter.route("/").get(getAllRecipes).post(postController).delete(deleteController)

module.exports = recipeRouter