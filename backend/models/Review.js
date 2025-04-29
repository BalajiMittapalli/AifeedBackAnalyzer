const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: null, // Optional field
    },
    productName: {
      type: String,
      default: null, // Optional field
    },
    review: {
      type: String,
      required: true,
    },
    classification: {
      type: String,
      enum: ["Genuine", "Fake"],
      required: true,
    },
    sentiment: {
      type: String,
      enum: ["Positive", "Negative", "Neutral"],
      required: true,
    },
    reason: {
      type: String,
    },
    accuracy: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Review", reviewSchema)
