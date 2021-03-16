const { model, Schema } = require( 'mongoose' );
const mongoosePaginate = require("mongoose-paginate-v2");

let dateTime = new Date();

const ActiveSchema = Schema({
    collaborator: { 
        type: Schema.ObjectId, 
        ref: 'Collaborator',
        required: true,
    },

    tool: {
        type: Schema.ObjectId, 
        ref: 'Tool',
        required: true,
    },

    date_active: {
        type: String,
        default: () => dateTime.toISOString().slice(0, 10),
        required: true,
    },

});

ActiveSchema.plugin(mongoosePaginate);

module.exports = model( 'Active', ActiveSchema );