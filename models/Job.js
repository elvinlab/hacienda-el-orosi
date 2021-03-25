const { model, Schema } = require("mongoose");

const JobSchema = Schema({
  name_job: {
    type: String,
    required: true,
    unique: true,
  },
  collaborator: { type: Schema.ObjectId, ref: "Collaborator" },
  description: {
    type: String,
    required: true,
  },
  work_hours: {
    type: Number,
    required: true,
  },
  price_extra_hours: {
    type: Number,
    required: false,
  },
  price_day: {
    type: Number,
    required: true,
  },
});

module.exports = model("Job", JobSchema);