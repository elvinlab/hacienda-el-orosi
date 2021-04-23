const Collaborator = require("../models/Collaborator.js");
const { response } = require("express");

const moment = require("moment");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const AWS = require("aws-sdk");
const view_report_collaborator_by_status = fs.readFileSync(
  "views/view_report_collaborator_by_status.html",
  "utf8"
);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const options = {
  phantomArgs: ["--web-security=yes"],
  format: "A3",
  orientation: "portrait",
  border: "10mm",
  header: {
    height: "45mm",
    contents: '<div style="text-align: center;">Reporte de colaboradores</div>',
  },
  footer: {
    height: "28mm",
    contents: {
      first: "Cover page",
      2: "Second page", // Any page number is working. 1-based index
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: "Last Page",
    },
  },
};

const register = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const {
      document_id,
      job,
      nationality,
      name,
      surname,
      direction,
      tel,
      cel,
      date_admission,
      dispatch_date,
    } = req.body;

   
    if (moment(date_admission) >= moment(dispatch_date)) {
      return res.status(400).json({
        status: false,
        msg: "La fecha inicial no puede superar o igual a la fecha final.",
      });
    }

    try {
      let findCollaboratorByDocumentId = await Collaborator.findOne({
        document_id,
      });

      if (findCollaboratorByDocumentId) {
        return res.status(400).json({
          status: false,
          msg: "El colaborador ya existe.",
        });
      }

      let collaborator = new Collaborator();

      collaborator.document_id = document_id;
      collaborator.contract_number = Math.floor(
        Math.random() * (999999 - 100000) + 100000
      );
      collaborator.job = job;
      collaborator.nationality = nationality;
      collaborator.name = name;
      collaborator.surname = surname;
      collaborator.direction = direction;
      collaborator.tel = tel;
      collaborator.cel = cel;
      collaborator.date_admission = moment(date_admission).format("YYYY-MM-DD");
      collaborator.dispatch_date = moment(dispatch_date).format("YYYY-MM-DD");

      await collaborator.save();

      const findNewCollaborator = await Collaborator.findById(
        collaborator._id
      ).populate("job");

      return res.status(200).json({
        status: true,
        msg: "Colaborador registrado con éxito.",
        collaborator: findNewCollaborator,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacté con un ING en Sistemas para más información.",
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: "No posees los privilegios necesarios en la plataforma.",
    });
  }
};

const update = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const collaboratorId = req.params.id;
    const {
      document_id,
      job,
      nationality,
      name,
      surname,
      direction,
      tel,
      cel,
      date_admission,
      dispatch_date,
    } = req.body;

    const findCollaboratorByDocumentId = await Collaborator.findOne({
      document_id,
    });

    if (
      findCollaboratorByDocumentId &&
      findCollaboratorByDocumentId._id != collaboratorId
    ) {
      return res.status(400).json({
        status: false,
        msg: "Esta cédula ya ha sido registrada anteriormente.",
      });
    }

    if (moment(date_admission) >= moment(dispatch_date)) {
      return res.status(400).json({
        status: false,
        msg: "La fecha inicial no puede superar o igual a la fecha final.",
      });
    }

    Collaborator.findByIdAndUpdate(
      { _id: collaboratorId },
      {
        document_id,
        job,
        nationality,
        name,
        surname,
        direction,
        tel,
        cel,
        date_admission: moment(date_admission).format("YYYY-MM-DD"),
        dispatch_date: moment(dispatch_date).format("YYYY-MM-DD"),
      },
      (err) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg: "Por favor contacté con un ING en Sistemas para más información.",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Datos del colaborador actualizados con éxito.",
          });
        }
      }
    );
  } else {
    res.status(500).json({
      status: false,
      msg: "No posees los privilegios necesarios en la plataforma.",
    });
  }
};

const changeStatus = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const { status, dispatch_date } = req.body;
    const collaboratorId = req.params.id;

    await Contract.findByIdAndUpdate(
      { _id: collaboratorId },
      { status: status, dispatch_date: dispatch_date },
      (err) => {
        if (err) {
          return res.status(400).json({
            status: false,
            msg: "Por favor contacté con un ING en Sistemas para más información.",
          });
        } else {
        return res.status(200).send({
            status: true,
            msg: "Estado del colaborador actualizado.",
          });
        }
      }
    );
  } else {
    res.status(500).json({
      status: false,
      msg: "No posees los privilegios necesarios en la plataforma.",
    });
  }
};

const getCollaboratorsByStatus = (req, res = response) => {
  const status = req.params.status;

  Collaborator.find({ status })
    .populate("job")
    .sort({ date_admission: -1 })
    .lean()
    .exec((err, collaborators) => {
      if (err) {
        return res.status(404).send({
          status: false,
          msg: "Error al realizar la consulta.",
        });
      }
      return res.status(200).json({
        status: true,
        collaborators: {
          collaboratorsState: status,
          collaborators: collaborators,
          count: collaborators.length,
        },
      });
    });
};
const getCollaborator = async (req, res = response) => {
  let document_id = req.params.id;

  await Collaborator.findOne({ document_id }).exec((err, collaborator) => {
    if (err || !collaborator) {
      return res.status(404).send({
        status: false,
        msg: "El colaborador no existe.",
      });
    }

    return res.status(200).send({
      status: true,
      collaborator: collaborator,
    });
  });
};

const generatePDFByCollaborator = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const status = req.params.status;

    try {
      const collaborators = await Collaborator.find({ status })
        .populate("job")
        .sort({ date_admission: -1 })
        .lean();

      var document = {
        html: view_report_collaborator_by_status,
        data: {
          collaborators: collaborators,
        },
        path: `storage/reporte-colaboradores-${
          status == "Activo" ? "activos" : "inactivos"
        }.pdf`,
        type: "pdf",
      };

      await pdf
        .create(document, options)
        .then((res) => {})
        .catch((error) => {
          console.error(error);
        });

      const fileContent = fs.readFileSync(
        `storage/reporte-colaboradores-${
          status == "Activo" ? "activos" : "inactivos"
        }.pdf`
      );
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `reporte-colaboradores-${
          status == "Activo" ? "activos" : "inactivos"
        }.pdf`,
        Body: fileContent,
      };

      s3.upload(params, function (err, data) {
        if (err) {
          throw err;
        }
        return res.status(200).send({
          status: true,
          link: data.Location,
        });
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        msg: "Por favor contacté con un ING en Sistemas para más información.",
      });
    }
  } else {
    res.status(500).json({
      status: false,
      msg: "No posees los privilegios necesarios en la plataforma.",
    });
  }
};

module.exports = {
  register,
  update,
  changeStatus,
  getCollaboratorsByStatus,
  generatePDFByCollaborator,
  getCollaborator,
};
