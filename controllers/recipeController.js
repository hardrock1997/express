const fsP = require("fs/promises");
const path = require("path");
const recipeModel = require("../models/recipeModel")
const mongoose = require("mongoose")

const filePath = path.join(__dirname, "../data/recipes.json");


const findRecipeById=(id)=>{
  return recipeModel.findOne({_id:id})
}


const getAllRecipes =  async (req, res) => {
  try {
    const recipes = await recipeModel.find()
    res.json({
      status: "success",
      data: {
        recipes: recipes,
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

const updateRecipePut = async (req,res)=>{
  let {recipeId} = req.params
  const newRecipe = req.body
  recipeId = new mongoose.Types.ObjectId(recipeId);
    const updatedRecipe = await recipeModel.findOneAndReplace(
      { _id: recipeId },
      newRecipe,
      { new: true, returnDocument: "after" } // Return the updated document
    );
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).
    json({
      message:"Recipe Updated"
    })
}


//http://localhost:1900/recipes/list/?sort=rating&page=1 price
// the above url will return the sorted data according to rating and in case of rating tie breaker, it will be returned
// according to increasing order of price
// but the " " in the url is encoded into some unwanted characters and so we will use _ 
//http://localhost:1900/recipes/list/?sort=rating_price&page=1

const listRecipes = async (req,res)=>{
  try {
    const {page=1,limit:limitValue=5, sort:sortValue="price", q="",selectValues="name price", ...filters} = req.query

    //find({filterCriteria:<filterCriteriaValue>}) and filters is {filterCriteria:<filterCriteriaValue>}
    //here find() just returns a thenable object and not a actual promise, instead if we use .exec() then it returns a promise
    let query = recipeModel.find(filters)

    //search functionality

    //making the regex for the case senstivity
    const matchString = new RegExp(q,"i")
    query = query.where("name").regex(matchString)

    const sortParams = sortValue.split("_").join(" ")

    query = query.sort(sortParams)
    //query objects are resolved only once, if we want to resolve again then we need another query object
    // this is being done to get the count of the recipes that match the given criteria and not the total count
    const queryClone = query.clone()
    const totalRecipes = await queryClone.countDocuments()

    query = query.skip(limitValue*(page-1))
    query = query.limit(limitValue)



    // specify the required or not required items
    //url for this: http://localhost:1900/recipes/list/?selectValues=-tags -ingredients
    //this will exclude the tags and ingridients from the response

    const selectParams = selectValues.split("_").join(" ")
    query = query.select(selectParams)



    const recipes = await query.exec()
  
    res.json({
      status: "success",
      data: {
        results:recipes.length,
        recipes: recipes,
        total:totalRecipes
      },
    });
  } catch (err) {
    console.log("_______",err)
    res.status(500);
    res.json({
      status: "failed",
      error: "Internal server error",
    });
  }
}

module.exports = {
  getAllRecipes,
  postController,
  deleteController,
  singleRecipeController,
  updateRecipePut,
  listRecipes
}