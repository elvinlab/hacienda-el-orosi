const Job = require("../models/Job.js");

const { response } = require("express");

const save = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const {
      name_job,
      description,
      work_hours,
      price_extra_hours,
      price_day,
    } = req.body;

    try {
      let findJobByName = await Job.findOne({ name_job });

      if (findJobByName) {
        return res.status(401).json({
          status: false,
          msg: "Esta actividad ya existe",
        });
      }

      let job = new Job();

      job.name_job = name_job;
      job.description = description;
      job.work_hours = work_hours;
      job.price_extra_hours = price_extra_hours;
      job.price_day = price_day;

      await job.save();
      return res.status(200).json({
        status: true,
        msg: "Actividad registrada con éxito",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacte con el administrador para más imformación",
      });
    }
  } else {
    return res.status(400).send({
      status: false,
      msg: "No puedes registrar la actividad",
    });
  }
};

const updateJob = async (req, res = response) => {

  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const { description, work_hours, price_extra_hours, price_day } = req.body;

    const jobId = req.params.id;

    const findJobByDocumentId = await Job.findOne({
      name_job,
    });

    if (
      findJobByDocumentId &&
      (findJobByDocumentId._id != jobId)
    ) {
      return res.status(400).json({
        status: "Error",
        msg: "Existe un trabajo con este nombre.",
      });
    }

    await Job.findByIdAndUpdate(
      { _id: jobId },
      { name_job, description, work_hours, price_extra_hours, price_day },
      (err) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg: "Por favor hable con el administrador",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Actividad actualizada con exito",
          });
        }
      }
    );
  } else {
    res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const removeJob = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    let jobId = req.params.id;
    Job.findOneAndDelete({ _id: jobId }, (err, job) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "Error al procesar la peticion",
        });
      }
      if (!job) {
        return res.status(404).send({
          status: false,
          msg: "No se ha eliminado el trabajo",
        });
      }
      return res.status(200).json({
        status: true,
        msg: "Actividad removida de forma exitosa",
      });
    });
  } else {
    return res.status(400).send({
      status: false,
      msg: "No puedes remover el trabajo",
    });
  }
};

const getJobs = async (req, res = response) => {
  const jobs = await Job.find();

  return res.status(200).json({
    status: true,
    jobs: jobs,
  });
};

module.exports = {
  save,
  removeJob,
  getJobs,
  updateJob,
};
