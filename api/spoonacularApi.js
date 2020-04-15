const axios = require("axios");
require("dotenv").config();
const fs = require("fs");

class SpoonacularApi {
  constructor(ingredients) {
    this.name = "APISpoonacular";
    this.url = "https://api.spoonacular.com/recipes";
    this.apiKey = process.env.SPOONACULAR_KEY;
    this.cleanedRecipes = [];
    this.ingredientNames = [];
    this.ingredients = [];
    this.tags = [];
  }

  handleBackupCall = async (originalReqIngredients) => {
    const recipeResponse = await this.searchRecipesByIngredient(
      originalReqIngredients
    );
    this.recipesToClean = recipeResponse.data;

    const detailsResponse = await this.searchRecipeDetail();
    this.recipeDetails = detailsResponse.data;
    await this.cleanTheRecipes();
    await this.createIngredientObjects();
    await this.saveResponseToFile();
    return this.cleanedRecipes;
  };

  searchRecipesByIngredient = async (ingredients, resNumber = 15) => {
    var url = `${this.url}/findByIngredients?apiKey=${this.apiKey}&ingredients=${ingredients}&instructionsRequired=true&fillIngredients=true&number=${resNumber}`;
    return axios.get(url);
  };

  searchRecipeDetail = async () => {
    let recipe_ids = this.recipesToClean.map((recipe) => recipe.id);
    var url = `${this.url}/informationBulk?apiKey=${this.apiKey}&ids=${recipe_ids}`;
    return await axios.get(url);
  };

  cleanTheRecipes = () => {
    this.recipesToClean.forEach((recipe) => {
      const cleanRecipe = {};
      cleanRecipe.title = recipe.title;
      cleanRecipe.image = recipe.image;
      cleanRecipe.originId = recipe.id;
      cleanRecipe.ingredients = [];
      recipe.missedIngredients &&
        recipe.missedIngredients.map((ingredient) => ingredient.name);
      cleanRecipe.ingredients.push(
        ...(recipe.usedIngredients &&
          recipe.usedIngredients.map((ingredient) => ingredient.name))
      );
      this.ingredientNames.push(...cleanRecipe.ingredients);
      // get details
      let match = this.recipeDetails.find(
        (details) => details.id === recipe.id
      );
      // let cuisines = match.cuisines
      // let courses = match.dishTypes
      // let diets = match.diets
      // let tags = [...diets, ...courses, ...cuisines]
      // this.createTagObject()
      let tags = match.cuisines;
      tags.push(...match.dishTypes);
      tags.push(...match.diets);
      cleanRecipe.tags = [...tags];
      cleanRecipe.readyTime = match.readyInMinutes;
      cleanRecipe.servings = match.servings;
      cleanRecipe.instructions =
        match.analyzedInstructions[0] && match.analyzedInstructions[0].steps;
      cleanRecipe.summary = match.summary;
      cleanRecipe.rating = match.averageRating;

      this.cleanedRecipes.push(cleanRecipe);
    });
    return this.cleanedRecipes;
  };

  createIngredientObjects = () => {
    const ingredNames = new Set([...this.ingredientNames]);
    ingredNames.forEach((ingredName) =>
      this.ingredients.push({
        name: ingredName,
        image: `https://spoonacular.com/cdn/ingredients_100x100/${ingredName}.jpg`,
      })
    );
  };

  saveResponseToFile() {
    const recipes = [...this.cleanedRecipes];
    const ingredients = [...new Set([...this.ingredients])];
    const date = Date.now();
    const content = `const recipes = ${JSON.stringify(
      recipes
    )} \n const ingredients = ${JSON.stringify(ingredients)}`;
    fs.writeFile(
      `./bin/apiResponseGroups/dbRes-${date}.js`,
      content,
      { flag: "a+" },
      (err) => {
        console.log(err);
      }
    );
  }
}

module.exports = SpoonacularApi;
