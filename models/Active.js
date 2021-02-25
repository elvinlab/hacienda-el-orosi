const { model, Schema } = require( 'mongoose' );
const moment =  require('moment');

moment.locale( 'es' );

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
        default: () => moment().format("DD-MM-YYYY"),
        required: true,
    },

});

module.exports = model( 'Active', ActiveSchema );