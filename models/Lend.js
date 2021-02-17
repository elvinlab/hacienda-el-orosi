const { model, Schema } = require( 'mongoose' );
const moment =  require('moment');

moment.locale( 'es' );

const LendSchema = Schema({
    collaborator: { 
        type: Schema.ObjectId, 
        ref: 'Collaborator',
        required: true,
    },

    date_issued: {
        type: String,
        default: () => moment().format("DD-MM-YYYY"),
        required: true,
    },

    status: {
        type: String,
        default: "active",
        required: true,
    },

    amount:{
        type: Number,
        required: true,
    } 
});


module.exports = model( 'Lend', LendSchema );