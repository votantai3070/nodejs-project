const mongoose = require("mongoose");
const Schema = mongoose.Schema;

commentSchema = new Schema(
  {
    rating: { type: Number, min: 1, max: 5, require: true },
    comment: { type: String, require: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
  },
  { timestamps: true }
);

const orchidSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    original: {
      type: String,
      required: true,
    },
    isNatural: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Orchid = mongoose.model("Orchid", orchidSchema);
module.exports = Orchid;
