const { model, Schema } = require("mongoose");
const moment = require("moment");
const mongoosePaginate = require("mongoose-paginate-v2");

moment.locale("es");

const CollaboratorSchema = Schema({
  document_id: {
    type: String,
    required: true,
  },
  administrator: { type: Schema.ObjectId, ref: "Administrator" },
  nationality: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
  },
  tel: {
    type: String,
    required: true,
  },
  cel: {
    type: String,
  },
  cel: {
    type: String,
    default: "active",
    required: true,
  },
  date_admission: {
    type: String,
    default: () => moment().format("DD-MM-YYYY"),
    require: true,
  },
  dispatch_date: {
    type: String,
    default: () => moment().format("DD-MM-YYYY"),
    require: true,
  },
});

CollaboratorSchema.plugin(mongoosePaginate);

module.exports = model("Collaborator", CollaboratorSchema);
