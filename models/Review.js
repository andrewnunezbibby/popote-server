const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  recipeId: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number
  },
  ratingCount: { type: Number }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
