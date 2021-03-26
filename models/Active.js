const { model, Schema } = require( 'mongoose' );
const moment = require("moment");

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
        default: () => moment(dateTime).format("YYYY-MM-DD"),
        required: true,
    },

});

module.exports = model( 'Active', ActiveSchema );