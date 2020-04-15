const { parentPort, MessagePort } = require("worker_threads");
const fs = require("fs");
const RecipeModel = require("../../models/Recipe");
require("dotenv").config();
require("../../config/mongo");

parentPort.on("message", (data) => {
  const { port } = data;
  const recipeState = [];

  var files = fs.readdirSync("./bin/apiResponseGroups");
  files.forEach((file) => {
    let { recipes, ingredients } = require(`../apiResponseGroups/${file}`);
    recipeState.push(...recipes);
  });
  const recipesToSave = [...new Set([...recipeState])];

  recipesToSave.forEach((recipe) => {
    console.log("!!!!BEGINNGING");
    const originId = recipe.originId;
    RecipeModel.find({ originId: originId })
      .then((preexistingRecipe) => {
        if (preexistingRecipe.length === 0) {
          RecipeModel.insert(recipe)
            .then((newRecipe) => {
              console.log(newRecipe[0].id);
              res.status(200).json({ msg: "recipe ok" });
              port.postMessage(`Recipe ${recipe.title} Create!`);
            })
            .catch((err) => {
              console.log("recipe save error", err);
            });
        } else {
          console.log("that recipe exists");
        }
      })
      .catch((err) => next(err));
  });

  files.forEach((file) => {
    fs.unlink(`./bin/apiResponseGroups/${file}`, (err) => {
      if (err) throw err;
      console.log(`./bin/apiResponseGroups/${file} was deleted`);
    });
  });
});
