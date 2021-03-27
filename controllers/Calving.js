const Animal = require("../models/Animal.js");
const moment = require("moment");
const { response } = require("express");

const addRegisterCalving = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const animalID = req.params.id;

    try {

      let animal = await Animal.findById({ _id: animalID });

      if (!animal || animal.gender != "Hembra") {
        return res.status(400).json({
          status: false,
          msg: "Solo se le pueden registrar partos a hembras",
        });
      }

      await animal.calving.unshift(req.body);

      await animal.save();

      return res.status(200).json({
        status: true,
        msg: "Parto registrado con exito",
        animal: animal,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacte con un ing en sistemas para mas información",
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const updateRegisterCalving = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const {date, complications } = req.body;
    const registerCalvingID = req.params.calving;
    const animalID = req.params.animal;

    try {
      let validate = false;
      let dateTime = new Date();
      let animal = await Animal.findById({ _id: animalID });

      animal &&
        animal.calving.forEach((element) => {
          if (element._id == registerCalvingID ) {
            if (element.date != moment(dateTime).format("YYYY-MM-DD")
            ) {
              validate = true;
            }
          }
        });

      if (validate) {
        return res.status(400).json({
          status: false,
          msg: "Numero de parto ya registrado o fecha diferente al registro",
        });
      }

      Animal.findOneAndUpdate(
        { "calving._id": registerCalvingID },
        {
          $set: {
            "calving.$.date": date,
            "calving.$.complications": complications,
          },
        },
        { new: true },
        (err, animal) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error en la petición",
            });
          }

          if (!animal) {
            return res.status(404).send({
              status: "error",
              message: "No existe registro",
            });
          }
          return res.status(200).send({
            status: true,
            msg: "Datos actualizados con exito",
            animal: animal,
          });
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacte con un ing en sistemas para mas información",
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const deleteRegisterCalving = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const registerCalvingID = req.params.calving;
    const animalID = req.params.animal;

    try {
      let validate = false;
      let dateTime = new Date();

      let animal = await Animal.findById({ _id: animalID });

      animal &&
        animal.calving.forEach((element) => {
          if (element._id == registerCalvingID) {
            if (element.date != moment(dateTime).format("YYYY-MM-DD")) {
              validate = true;
            }
          }
        });

      if (validate) {
        return res.status(400).json({
          status: false,
          msg:
            "Numero de parto no se puede eliminar porque tiene fecha diferente al registro",
        });
      }

      let regCalving = await animal.calving.id(registerCalvingID);

      regCalving.remove();

      await animal.save();

      return res.status(200).json({
        status: true,
        animal: animal,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacte con un ing en sistemas para mas información",
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

module.exports = {
  addRegisterCalving,
  updateRegisterCalving,
  deleteRegisterCalving,
};
