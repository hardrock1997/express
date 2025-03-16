const fsP = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "../data/recipes.json");
const postController  =async (req, res) => {
  try {
    const data = req.body;
    const oldRecipes = await fsP.readFile(filePath, "utf-8");
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
}
module.exports = postController