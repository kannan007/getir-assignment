const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    value: { type: String },
    balance: { type: Number },
    counts: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const recordsModel = mongoose.model("Record", recordSchema);

module.exports = recordsModel;
