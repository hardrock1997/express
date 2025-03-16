const fsP = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "../data/recipes.json");



/**
 * There are 3 options to send the id of the recipe to be deleted
 * 1 In the request body, path will be /recipes
 * 2 In the url as the param, path will be /recipes/<id>
 * 3 In the url as the query, path will be /recipes/?id=<id value>
 */

const deleteController = async (req, res) => {
  try {
    const id = req.body.id
    // , url will be /recipes
    // let {id} = req.params, url will be /recipes/:id
    // let {id} = req.query 
    // id=Number(id)
    // , url will be /recipes?id=<Id value>
    const oldRecipes = await fsP.readFile(filePath, "utf-8");
    let dataArr = JSON.parse(oldRecipes);
    if (dataArr.find((recipe) => recipe.id === id)) {
      const indexOfRecipeToBeDeleted = dataArr.findIndex(
        (recipe) => recipe.id === id
      );
      dataArr.splice(indexOfRecipeToBeDeleted, 1);
      await fsP.writeFile("./data/recipes.json", JSON.stringify(dataArr));
      res.status(200); //204 and there will be no response sent to the client
      res.json({
        message: "Recipe deleted successfully",
      });
    } else {
      res.status(400);
      res.json({
        status:"Failed",
        message: "Not found, Invalid recipe id",
      });
    }
  } catch (err) {
    res.status(500);
    res.json({
      status: "failed",
      error: "Internal server error",
    });
  }
}

module.exports = deleteController

