const { model, Schema } = require("mongoose");
const moment = require("moment");

let dateTime = new Date();

const JobSchema = Schema({
  name: {
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

  create_at: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
  },
});

module.exports = model("Job", JobSchema);
