const Animal = require("../models/Animal.js");

const { ObjectId } = require("mongodb");
const { response } = require("express");

const register = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "CATTLE_ROLE") {
    const administratorID = req.user.id;
    const {
      plate_number,
      type_animal,
      status,
      race,
      age,
      date_admission,
      daughter_of,
      weight,
      weekly_weight,
      place_origin,
      name,
      photo,
      photo_register,
      gender,
      next_due_date,
      complications,
      number_deliveries,
    } = req.body;

    try {
      let findCowByPlateNumber = await Animal.findOne({
        plate_number,
      });

      if (findCowByPlateNumber) {
        return res.status(400).json({
          status: "error",
          msg: `La vaca ${name} con el numero de chapa ${plate_number} ya existe`,
        });
      }

      let cow = new Animal();

      cow.administrator = administratorID;
      cow.plate_number = plate_number;
      cow.race = race;
      cow.status = status;
      cow.step = step;
      cow.age = age;
      cow.type_cow = type_cow;
      cow.name = name;
      cow.photo = photo;
      cow.next_due_date = next_due_date;
      cow.complications = complications;
      cow.number_deliveries = number_deliveries;

      await cow.save();

      return res.status(200).json({
        status: "success",
        msg: `La vaca ${name} con el numero de chapa ${plate_number} fue registrada con exito`,
        cow: cow,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        msg:
          "Por favor contacte con un ingeniero en sistemas para mas información",
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
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "CATTLE_ROLE") {
    const cowID = req.params.id;
    const {
        plate_number,
        race,
        status,
        step,
        age,
        name,
        photo,
        type_cow,
        next_due_date,
        complications,
        number_deliveries,
    } = req.body;

    const findCowByPlateNumber = await Collaborator.findOne({
        plate_number,
    });

    if (
      findCowByPlateNumber &&
      findCowByPlateNumber._id != cowId
    ) {
      return res.status(400).json({
        status: "Error",
        msg: "Existe una vaca con esta cedula.",
      });
    }

    Collaborator.findByIdAndUpdate(
      { _id: cowId },
      {
        document_id,
        job: jobId,
        nationality,
        name,
        surname,
        direction,
        tel,
        cel,
      },
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

module.exports = {
  register,
  update,
};
