const Job = require ( '../models/Job.js' );

const { response } = require ( 'express' );
const { request } =require ( '../Express_server.js' );
const app = require ( '../Express_server.js' );

const register = (req , res = response) => {
const{name_job, description, work_hours, extra_hours, price_day } = req.body;

try{
    let Job = new Job();
    Job.name_job = name_job;
    Job.description = description;
    Job.work_hours = work_hours;
    Job.extra_hours = extra_hours;
    Job.price_day = price_day;

    Job.save();
    return res.status( 200 ).json({
        status: 'success',
        msg: 'tarea registrada con exito',
    })
} catch ( error ) {
    return res.status ( 500 ).json({
        status: 'error',
        msg: 'porfavor contacte con el administrador para mas imformacion',
    })
}};

const update = (req, res= response) =>{

};
module.exports ={
    register,
};