const fsP = require("fs/promises");
const path = require("path");
const recipeModel = require("../models/recipeModel")

const filePath = path.join(__dirname, "../data/recipes.json");


const getAllRecipes =  async (req, res) => {
  try {
    const recipe = await recipeModel.find()
    res.json({
      status: "success",
      data: {
        recipes: recipe,
      },
    });
  } catch (err) {
    res.status(500);
    res.json({
      status: "failed",
      error: "Internal server error",
    });
  }
}

const postController  =async (req, res) => {
  try {
    const data = req.body;
    let newRecipe
    try{
       newRecipe = await recipeModel.create(data)
    }
    catch(err) {
      res.status(400);
      res.json({
        status: "failed",
        message: err._message,
      });
      return
    }
    
    res.status(201);
    res.json({
      status: "success",
      data:{
        recipe:newRecipe
      }
    });

   
  } catch (err) {
    res.status(500);
    res.json({
      status: "failed",
      error: "Internal server error",
    });
  }
}


/**
 * There are 3 options to send the id of the recipe to be deleted
 * 1 In the request body, path will be /recipes, const id = req.body.id
 * 2 In the url as the param, path will be /recipes/<id>, let {id} = req.params /recipes/:id in the router code
 * 3 In the url as the query, path will be /recipes/?id=<id value>, let {id} = req.query
 * id=Number(id) as id will be in the string
 */

const findRecipeById=(id)=>{
  return recipeModel.findOne({_id:id})
}

const deleteController = async (req, res) => {
  try {
    const id = req.body.id
    const isRecipePresent = await findRecipeById(id)
    if(!isRecipePresent) {
        res.status(400);
        res.json({
          status:"Failed",
          message: "Not found, Invalid recipe id",
        });
        return
    }
    await recipeModel.deleteOne({_id:id})
    res.status(204); //204 and there will be no response sent to the client
      res.json({
        message: "Recipe deleted successfully",
      });
  } catch (err) {
    res.status(500);
    res.json({
      status: "failed",
      error: "Internal server error",
    });
  }
}


const singleRecipeController = async (req,res)=>{
    try {
        let {recipeId} = req.params
        const recipeWithParamId = await findRecipeById(recipeId)        
        if(recipeWithParamId) {
            res.status(200)
            res.json({
                status: "success",
                data: {
                  recipes: recipeWithParamId,
                },
            })
            return
        }
        res.status(400)
        res.json({
          status:"Failed",
          message: "Not found, Invalid recipe id",
        });
    }
    catch(err) {
        res.status(500);
        res.json({
          status: "failed",
          error: "Internal server error",
        });
    }

}

/**
 * Todo: 
 * Implement put api
 * Implement patch api
 */

module.exports = {
  getAllRecipes,
  postController,
  deleteController,
  singleRecipeController
}