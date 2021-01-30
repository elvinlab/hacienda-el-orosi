const { model, Schema } = require("mongoose");
const moment = require("moment");
const mongoosePaginate = require("mongoose-paginate-v2");

moment.locale("es");

const JobSchema = Schema({
  name_job: {
    type: String,
    required: true,
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
  extra_hours: {
    type: Number,
    required: false,
  },
  price_day: {
    type: Number,
    required: true,
  },
});

module.exports = model("Job", JobSchema);
