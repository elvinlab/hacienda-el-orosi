const { model, Schema } = require("mongoose");

const DietSchema = Schema({
  stage: {
    type: String,
    required: true,
    unique: true,
  },
  diet_name: {
    type: String,
    required: true,
    unique: true,
  },
  animal: { type: Schema.ObjectId, ref: "Animal" },
  aliment: { type: Schema.ObjectId, ref: "Aliment" },
});

module.exports = model("Diet", DietSchema);