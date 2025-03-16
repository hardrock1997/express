const express = require("express");
const fsP = require("fs/promises");

const app = express();

// use this middleware to convert the req body in the json format
// after using this middleware, body property is available in the request body
//and internally calls the next()
//----------------------------------------------------------------------------
app.use(express.json());

// sending a generic message
// res.send("App is running....")
//-------------------------------
// sending response in the json format
// res.json({
//       status:"app is running"
//   })
//-------------------------------

app.get("/recipes", async (req, res) => {
  try {
    const data = await fsP.readFile("./data/recipes.json", "utf-8");
    const dataArr = JSON.parse(data);
    res.json({
      status: "success",
      data: {
        recipes: dataArr,
      },
    });
  } catch (err) {
    res.status(500);
    res.json({
      status: "failed",
      error: "Internal server error",
    });
  }
});

app.post("/recipes", async (req, res) => {
  try {
    const data = req.body;
    const oldRecipes = await fsP.readFile("./data/recipes.json", "utf-8");
    const dataArr = JSON.parse(oldRecipes);
    const lastIndex = dataArr.length - 1;
    if (lastIndex === -1) {
      data.id = 1;
    } else {
      const idOfLastRecipe = dataArr[lastIndex]?.id;
      data.id = idOfLastRecipe + 1;
    }
    dataArr.push(data);
    await fsP.writeFile("./data/recipes.json", JSON.stringify(dataArr));
    res.status(201);
    res.json({
      status: "in-progress",
    });
  } catch (err) {
    res.status(500);
    res.json({
      status: "failed",
      error: "Internal server error",
    });
  }
});


/**
 * There are 3 options to send the id of the recipe to be deleted
 * 1 In the request body, path will be /recipes
 * 2 In the url as the param, path will be /recipes/<id>
 * 3 In the url as the query, path will be /recipes/?id=<id value>
 */
app.delete("/recipes", async (req, res) => {
  try {
    const id = req.body.id
    // , url will be /recipes
    // let {id} = req.params, url will be /recipes/:id
    // let {id} = req.query 
    // id=Number(id)
    // , url will be /recipes?id=<Id value>
    const oldRecipes = await fsP.readFile("./data/recipes.json", "utf-8");
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
});

app.listen(1900, () => {
  console.log("App started...............");
});
