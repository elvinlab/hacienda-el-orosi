const Health = require("../models/Health.js");

const { ObjectId } = require("mongodb");
const { response } = require("express");

const register = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const animalID = req.params.id;
    const { medicamentID, dose, human_consumed_date } = req.body;

    try {
      let health = new Health();

      health.animal = animalID;
      health.medicament = medicamentID;
      health.dose = dose;
      health.human_consumed_date = human_consumed_date;

      await health.save();

      return res.status(200).json({
        status: true,
        msg: "Registro de salud registrado con éxito",
        health,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacté con un ING en Sistemas para más información",
      });
    }
  } else {
    return res.status(400).send({
      status: false,
      msg: "No posees los privilegios necesarios en la plataforma.",
    });
  }
};

const getMedicalRecords = async (req, res = response) => {
  let page = undefined;

  if (
    !req.params.page ||
    req.params.page == 0 ||
    req.params.page == "0" ||
    req.params.page == null ||
    req.params.page == undefined
  ) {
    page = 1;
  } else {
    page = parseInt(req.params.page);
  }
  const options = {
    sort: { administrator_date: -1 },
    limit: 10,
    page: page,
  };
  Health.paginate({}, options, (err, health) => {
    if (err) {
      return res.status(500).send({
        status: false,
        msg: "Error al hacer la consulta.",
      });
    }

    return res.status(200).json({
      status: true,
      health: {
        health: health.docs,
        count: health.totalDocs,
      },
    });
  });
};

module.exports = {
  register,
  getMedicalRecords,
};
