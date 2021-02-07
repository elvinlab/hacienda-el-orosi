const Payment = require("../models/Payment.js");
const { response } = require("express");
const { ObjectId } = require("mongodb");

const register = (req, res = response) => {
  const { net_salary, salary, details } = req.body;

  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    //valido el roll
    try {
      let payment = new Payment();

      payment.administrator = req.user.id; //seteo al modelo.
      payment.collaborator = req.params.id;
      payment.net_salary = net_salary;
      payment.final_salary = salary;
      payment.details = details;

      payment.save();
      return res.status(200).json({
        status: "succes",
        msg: "Pago realizado con exito",
      });
    } catch (error) {
      return res.status(500).json({
        status: "Error",
        msg: "Porfavor contacte con el Administrador para mas información",
      });
    }
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const paymentsByCollaborator = (req, res = response) => {
  const collaboratorId = req.params.id;

  Payment.find({ collaborator: ObjectId(collaboratorId) })
    .sort([["pay_day", "descending"]])
    .exec((err, payments) => {
      if (err) {
        // Devolver resultado
        return res.status(500).send({
          status: "error",
          msg: "Error en la peticion",
        });
      }

      if (!payments) {
        // Devolver resultado
        return res.status(404).send({
          status: "error",
          msg: "No hay pagos por mostrar",
        });
      }

      // Devolver resultado
      return res.status(200).send({
        status: "success",
        payments,
      });
    });
};

const paymentsByAdministrator = (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE") {
    const administratorId = req.params.id;

    Payment.find({ administrator: ObjectId(administratorId) })
      .sort([["pay_day", "descending"]])
      .exec((err, payments) => {
        if (err) {
          // Devolver resultado
          return res.status(500).send({
            status: "error",
            msg: "Error en la peticion",
          });
        }

        if (!payments) {
          // Devolver resultado
          return res.status(404).send({
            status: "error",
            msg: "No hay pagos por mostrar",
          });
        }

        // Devolver resultado
        return res.status(200).send({
          status: "success",
          payments,
        });
      });
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};
const getPayments = (req, res = response) => {

  
};

module.exports = {
  register,
  paymentsByCollaborator,
  paymentsByAdministrator,
  getPayments,
};
