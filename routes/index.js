var express = require("express");
var router = express.Router();
const tagModel = require("../models/Tag");
const IngredientModel = require("../models/Ingredient");
const UserModel = require("../models/User");

/* GET home page. */
router.get("/", function(req, res, next) {
  tagModel
      .find()
      .then(apiRes => {
          console.log(apiRes)
          res.status(200).json({apiRes})
      })
      .catch(apiErr => console.error(apiRes))
});

/* GET ingredients list   */
router.get("/ingredients", function(req, res) {
  IngredientModel.find()
    .then(ingredients => {
      res.status(200).json(ingredients);
    })
    .catch(err => {
      console.log(err);
    });
});

/* GET favorite recipes */
router.get("/favorites/:userId", (req, res) => {
  UserModel.findById(req.params.userId)
    .populate("favorites")
    .then(recipes => {
      console.log(recipes);
      res.status(200).json(recipes);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;

