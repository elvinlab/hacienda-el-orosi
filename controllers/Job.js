const Job = require("../models/Job.js");

const { response } = require("express");

const save = (req, res = response) => {
  const {
    name_job,
    description,
    work_hours,
    extra_hours,
    price_day,
  } = req.body;

  try {
    let job = new Job();
    job.name_job = name_job;
    job.description = description;
    job.work_hours = work_hours;
    job.extra_hours = extra_hours;
    job.price_day = price_day;

    job.save();
    return res.status(200).json({
      status: "success",
      msg: "Actividad registrada con éxito",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      msg: "Por favor contacte con el administrador para más imformación",
    });
  }
};

const update = (req, res = response) => {
    
};
module.exports = {
  save,
};
