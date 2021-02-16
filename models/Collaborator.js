const { model, Schema } = require("mongoose");
const moment = require("moment");
const mongoosePaginate = require("mongoose-paginate-v2");

moment.locale("es");

const CollaboratorSchema = Schema({
  document_id: {
    type: String,
    unique: true,
    required: true,
  },
  administrator: { type: Schema.ObjectId, ref: "Administrator" },
  nationality: {
    type: String,
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  direction: {
    type: String,
  },
  tel: {
    type: String,
  },
  cel: {
    type: String,
  },
  status: {
    type: String,
    default: "active",
  },
  date_admission: {
    type: String,
    default: () => moment().format("DD-MM-YYYY"),
  },
  dispatch_date: {
    type: String,
  },
});

CollaboratorSchema.plugin(mongoosePaginate);

module.exports = model("Collaborator", CollaboratorSchema);
