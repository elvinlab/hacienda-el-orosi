const Animal = require("../models/Animal.js");

const { ObjectId } = require("mongodb");
const { response } = require("express");

const register = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del Ganado") {
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
          status: true,
          msg: `El animal con numero de chapa ${plate_number} ya existe`,
        });
      }

      let animal = new Animal();

      animal.administrator = administratorID;
      animal.plate_number = plate_number;
      animal.type_animal = type_animal;
      animal.status = status;
      animal.race = race;
      animal.age = age;
      animal.date_admission = date_admission;
      animal.daughter_of = daughter_of;
      animal.weight = weight;
      animal.weekly_weight = weekly_weight;
      animal.place_origin = place_origin;
      animal.name = name;
      animal.photo = photo;
      animal.photo_register = photo_register;
      animal.gender = gender;
      animal.next_due_date = next_due_date;
      animal.complications = complications;
      animal.number_deliveries = number_deliveries;

      await animal.save();

      return res.status(200).json({
        status: true,
        msg: `El numero de chapa ${plate_number} fue registrada con exito`,
        animal: animal,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg:
          "Por favor contacte con un ingeniero en sistemas para mas información",
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const update = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del Ganado") {
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

    if (findCowByPlateNumber && findCowByPlateNumber._id != cowId) {
      return res.status(400).json({
        status: false,
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
            status: false,
            msg: "Por favor hable con el administrador",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Datos del colaborador actualizados con exito",
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

module.exports = {
  register,
  update,
};
