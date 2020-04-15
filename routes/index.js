var express = require("express");
var router = express.Router();
const tagModel = require("../models/Tag");
const IngredientModel = require("../models/Ingredient");
const UserModel = require("../models/User");
const RecipeModel = require("../models/Recipe");
const SpoonacularApi = require("../api/SpoonacularApi");

/* GET home page. */
router.get("/", function (req, res, next) {
  tagModel
    .find()
    .then((apiRes) => {
      res.status(200).json({ apiRes });
    })
    .catch((apiErr) => console.error(apiRes));
});

/* GET ingredients list   */
router.get("/ingredients", function (req, res) {
  IngredientModel.find()
    .then((ingredients) => {
      res.status(200).json(ingredients);
    })
    .catch((err) => {
      console.log(err);
    });
});
/*get recipe page detail */
router.get("/recipe/:recipeId", function (req, res) {
  RecipeModel.findById(req.params.recipeId)
    .then((recipe) => {
      res.status(200).json(recipe);
    })
    .catch((err) => {
      console.log(err);
    });
});

/*get all recipes available in the database */
router.get("/recipes", function (req, res) {
  RecipeModel.find(req.params.recipeId)
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((err) => {
      console.log(err);
    });
});
// get all the recipes matching the summary or ingredients need to see

router.get("/recipes/ingredients", function (req, res, next) {
  const ingredients = req.query.ingredients.split(",");

  const dbPromises = ingredients.map((i) => {
    const regex = new RegExp(i, "gi");
    return RecipeModel.find({ summary: { $regex: regex } });
  });

  const spoonpiPromises = ingredients.map((ingredient) => {
    const spoonpi = new SpoonacularApi();
    return spoonpi.handleBackupCall(ingredient);
  });

  Promise.all(dbPromises)
    .then((recipes) => {
      const uniquifiedFlattenReceipes = [...new Set(recipes.flat())];
      if (uniquifiedFlattenReceipes.length === 0) {
        Promise.all(spoonpiPromises).then((spoonpiRecipes) => {
          const spoonpiFlattened = [...new Set(spoonpiRecipes.flat())];
          res.status(200).json(spoonpiFlattened);
        });
      } else {
        res.status(200).json(uniquifiedFlattenReceipes);
      }
    })
    .catch((err) => {
      next(err);
    });
});

/* GET favorite recipes */
router.get("/favorites/:userId", (req, res) => {
  UserModel.findById(req.params.userId)
    .populate({ path: "favorites", model: RecipeModel })
    .then((recipes) => {
      res.status(200).json(recipes);
    })
    .catch((err) => {
      console.log(err);
    });
});

/*FIND AND add  favorite recipes */
router.patch("/favorites/:userId/:recipeId", (req, res, next) => {
  console.log("userId", req.params.userId);
  console.log("recipeId", req.params.recipeId);
  UserModel.findByIdAndUpdate(
    req.params.userId,
    {
      $push: { favorites: req.params.recipeId },
    },
    {
      new: true,
    }
  )
    .then((dbRes) => {
      console.log(dbRes);
      res.status(200).json(dbRes);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/favorites/:userId/:recipeId", (req, res, next) => {
  console.log("userId", req.params.userId);
  console.log("recipeId", req.params.recipeId);
  UserModel.findByIdAndUpdate(
    req.params.userId,
    {
      $pull: { favorites: req.params.recipeId },
    },
    {
      new: true,
    }
  )
    .then((dbRes) => {
      console.log(dbRes);
      res.status(200).json(dbRes);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
