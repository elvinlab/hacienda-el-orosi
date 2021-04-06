const Job = require("../models/Job.js");
const Collaborator = require("../models/Collaborator.js");

const { response } = require("express");
const { ObjectId } = require("mongodb");

const save = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const {
      name,
      description,
      work_hours,
      price_extra_hours,
      price_day,
    } = req.body;

    try {
      let findJobByName = await Job.findOne({ name });

      if (findJobByName) {
        return res.status(401).json({
          status: false,
          msg: "Este trabajo ya existe",
        });
      }

      let job = new Job();

      job.name = name;
      job.description = description;
      job.work_hours = work_hours;
      job.price_extra_hours = price_extra_hours;
      job.price_day = price_day;

      await job.save();
      return res.status(200).json({
        status: true,
        msg: "Trabajo registrada con éxito",
        job: job,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacte con el administrador para más informacion",
      });
    }
  } else {
    return res.status(400).send({
      status: false,
      msg: "No puedes registrar el trabajo",
    });
  }
};

const updateJob = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const {
      name,
      description,
      work_hours,
      price_extra_hours,
      price_day,
    } = req.body;

    const jobId = req.params.id;

    const findJobByDocumentId = await Job.findOne({
      name,
    });

    if (findJobByDocumentId && findJobByDocumentId._id != jobId) {
      return res.status(400).json({
        status: "Error",
        msg: "Existe un trabajo con este nombre.",
      });
    }

    await Job.findByIdAndUpdate(
      { _id: jobId },
      { name, description, work_hours, price_extra_hours, price_day },
      { new: true },
      (err, job) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg: "Por favor hable con el administrador",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Trabajo actualizado con exito",
            job: job,
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

    const finJobByID = await Collaborator.findOne({ job: ObjectId(jobId) });
    console.log(finJobByID);
    if (finJobByID) {
      return res.status(404).send({
        status: false,
        msg:
          "Este trabajo se encuentra acualmente signado en algun colaborador",
      });
    }

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
        msg: "Trabajo removido de forma exitosa",
        job: job,
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
  const jobs = await Job.find().sort({ create_at: -1 });

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
