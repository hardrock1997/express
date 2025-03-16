const fsP = require("fs/promises");
const path = require("path");

const filePath = path.join(__dirname, "../data/recipes.json");


const getAllRecipes =  async (req, res) => {
  try {
    const data = await fsP.readFile(filePath, "utf-8");
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
}

module.exports = getAllRecipes