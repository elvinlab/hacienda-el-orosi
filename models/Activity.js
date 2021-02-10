const { model, Schema } = require("mongoose");
const moment = require("moment");

moment.locale("es");

const ActivitySchema = Schema({
  job: { type: Schema.ObjectId, ref: "Job" },
  collaborator: { type: Schema.ObjectId, ref: "Collaborator" },
});

module.exports = model("Activity", ActivitySchema);