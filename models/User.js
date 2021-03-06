const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  avatar: {
    type: String,
    default: "https://cdn.onlinewebfonts.com/svg/img_258083.png"
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  tags: {
    type: []
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe"
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
