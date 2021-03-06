const Collaborator = require("../models/Collaborator.js");
const Activity = require("../models/Activity.js");

const { ObjectId } = require("mongodb");
const { response } = require("express");

const register = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const {
      document_id,
      nationality,
      name,
      surname,
      direction,
      tel,
      cel,
    } = req.body;

    try {
      let findCollaboratorByDocumentId = await Collaborator.findOne({
        document_id,
      });

      if (findCollaboratorByDocumentId) {
        return res.status(400).json({
          status: "error",
          msg: "El colaborador ya existe",
        });
      }

      let collaborator = new Collaborator();

      collaborator.document_id = document_id;
      collaborator.nationality = nationality;
      collaborator.name = name;
      collaborator.surname = surname;
      collaborator.direction = direction;
      collaborator.tel = tel;
      collaborator.cel = cel;

      await collaborator.save();

      return res.status(200).json({
        status: "success",
        msg: "Colaborador registrado con exito",
      });
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        msg: "Por favor contacte con el Administrador para mas información",
      });
    }
  } else {
    return res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const update = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const collaboratorId = req.params.id;
    const { nationality, name, surname, direction, tel, cel } = req.body;

    await Collaborator.findByIdAndUpdate(
      { _id: collaboratorId },
      { nationality, name, surname, direction, tel, cel },
      (err) => {
        if (err) {
          res.status(400).json({
            status: "error",
            msg: "Por favor hable con el administrador",
          });
        } else {
          res.status(200).send({
            status: "success",
            msg: "Datos del colaborador actualizados con exito",
          });
        }
      }
    );
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const changeStatus = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { status, dispatch_date } = req.body;
    const collaboratorId = req.params.id;

    await Contract.findByIdAndUpdate(
      { _id: collaboratorId },
      { status: status, dispatch_date: dispatch_date },
      (err) => {
        if (err) {
          res.status(400).json({
            status: "error",
            msg: "Por favor hable con el administrador",
          });
        } else {
          res.status(200).send({
            status: "success",
            msg: "Estado actualizado para el colaborador",
          });
        }
      }
    );
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const getCollaboratorsByStatus = (req, res = response) => {
  const status = req.params.status;

  Collaborator.find({ status }).exec((err, collaborators) => {
    if (err) {
      return res.status(404).send({
        status: "error",
        msg: "Error al hacer la consulta",
      });
    }

    return res.status(200).json({
      status: "success",
      collaborators: {
        collaboratorsState: status,
        collaborators: collaborators,
        count: collaborators.length,
      },
    });
  });
};

const assignWork = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { collaboratorId, jobId } = req.body;

    let activity = new Activity();

    activity.collaborator = collaboratorId;
    activity.job = jobId;

    await activity.save();
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const removeAssignWork = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    let activityId = req.params.id;

    Activity.findOneAndDelete({ _id: activityId }, (err, activity) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al solicitar la peticion",
        });
      }
      if (!activity) {
        return res.status(404).send({
          status: "error",
          msg: "No se ha eliminado la actividad",
        });
      }
      return res.status(200).json({
        status: "success",
        msg: "Removido de forma exitosa",
      });
    });
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const listActivities = async (req, res = response) => {
  Activity.find().exec((err, activities) => {
    if (err || !activities) {
      return res.status(404).send({
        status: "error",
        msg: "Error inesperado",
      });
    }

    return res.status(200).json({
      status: "success",
      activities: activities,
    });
  });
};

const listActivitiesByCollaborator = async (req, res = response) => {
  const collaboratorId = req.params.id;
  Activity.find({ collaborator: ObjectId(collaboratorId) }).exec(
    (err, activities) => {
      if (err) {
        res
          .status(500)
          .send({ status: "error", msg: "Ocurrió un error en el servidor." });
      } else {
        if (activities) {
          res.status(200).send({ status: "success", activities: activities });
        } else {
          res
            .status(500)
            .send({ status: "error", msg: "Sin trabajos asignados" });
        }
      }
    }
  );
};

const getCollaborator = async (req, res = response) => {
  let document_id = req.params.id;

  await Collaborator.findOne({ document_id }).exec((err, collaborator) => {
    if (err || !collaborator) {
      return res.status(404).send({
        status: "error",
        msg: "Colaborador no existe",
      });
    }

    return res.status(200).send({
      status: "success",
      collaborator: collaborator,
    });
  });
};

module.exports = {
  register,
  update,
  changeStatus,
  getCollaboratorsByStatus,
  assignWork,
  removeAssignWork,
  listActivities,
  listActivitiesByCollaborator,
  getCollaborator,
};
