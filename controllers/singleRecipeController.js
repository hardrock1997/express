const fsP = require("fs/promises")
const path = require("path");
const filePath = path.join(__dirname, "../data/recipes.json");

const singleRecipeController = async (req,res)=>{
    try {
        const data = await fsP.readFile(filePath,"utf-8")
        const recipes = JSON.parse(data)
        let {recipeId} = req.params
        recipeId = Number(recipeId)
        const recipeWithParamId = recipes.filter(recipe=>recipe.id===recipeId)[0]
        
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
        res.status(404)
        res.json({
            status:"failed",
            message:"No recipe found with the given id"
        })
    }
    catch(err) {
        res.status(500);
        res.json({
          status: "failed",
          error: "Internal server error",
        });
    }

}

module.exports = singleRecipeController