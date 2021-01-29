const { model, Schema } = require( 'mongoose' );
const moment =  require('moment');
const mongoosePaginate = require('mongoose-paginate-v2');

moment.locale( 'es' );

const CollaboratorSchema = Schema ({ 
    id: { 
        type: String,
        required: true,
    },
    administrator: { type: Schema.ObjectId, ref: 'Administrator', },
    job: { type: Schema.ObjectId, ref: 'Job', },
    nationality: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    last_name: {
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
    date_admission: {
        type: String,
        default: () => moment().format("DD, MM  YYYY, HH:MM:SS"),
       // require: true,
    },
    dispatch_date: {
        type: String,
        default: () => moment().format("DD, MM  YYYY, HH:MM:SS"),
       // require: true,
    },
}); 

module.exports = model( 'Collaborator', CollaboratorSchema );