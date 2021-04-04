const Animal = require("../models/Animal.js");
const moment = require("moment");
const { response } = require("express");

const addRegisterWeight = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const animalID = req.params.animal;

    try {
      let validate = false;

      let animal = await Animal.findById({ _id: animalID });

      if (!animal || animal.status == "Vendido") {
        return res.status(400).json({
          status: false,
          msg: "Animal no registrado o no se encuentra en la hacienda",
        });
      }

      animal.weight.forEach((element) => {
        if (element.date == req.body.date) {
          validate = true;
        }
      });

      if (validate) {
        return res.status(400).json({
          status: false,
          msg: "No se puede registrar mas de un peso por dia",
        });
      }

      await animal.weight.unshift(req.body);

      await animal.save();

      return res.status(200).json({
        status: true,
        msg: "Peso de animal guardado con exito",
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

const updateRegisterWeight = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { weight, date, observations } = req.body;
    const animalID = req.params.animal;
    const weightID = req.params.weight;

    try {
      let validate = false;
      let dateTime = new Date();

      let animal = await Animal.findById({ _id: animalID });

      animal &&
        animal.weight.forEach((element) => {
          if (element._id == weightID) {
            if (element.date != moment(dateTime).format("YYYY-MM-DD")) {
              validate = true;
            }
          }
        });

      if (validate) {
        return res.status(400).json({
          status: false,
          msg:
            "No se puede actualizar ya que tiene una fecha diferente al registro",
        });
      }

      Animal.findOneAndUpdate(
        { "weight._id": weightID },
        {
          $set: {
            "weight.$.weight": weight,
            "weight.$.date": date,
            "weight.$.observations": observations,
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

const deleteRegisterWeight = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const animalID = req.params.animal;
    const weightID = req.params.weight;

    try {
      let validate = false;
      let dateTime = new Date();

      let animal = await Animal.findById({ _id: animalID });

      animal &&
        animal.weight.forEach((element) => {
          if (element._id == weightID) {
            if (element.date != moment(dateTime).format("YYYY-MM-DD")) {
              validate = true;
            }
          }
        });

      if (validate) {
        return res.status(400).json({
          status: false,
          msg:
            "No se puede eliminar ya que tiene una fecha diferente al registro",
        });
      }

      let reg = await animal.weight.id(weightID);

      reg.remove();

      await animal.save();

      return res.status(200).json({
        status: true,
        msg: "Registro eliminado con exito",
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
  addRegisterWeight,
  updateRegisterWeight,
  deleteRegisterWeight,
};
