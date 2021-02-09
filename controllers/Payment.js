const Payment = require("../models/Payment.js");
const { response } = require("express");
const { ObjectId } = require("mongodb");

const registerSalaryCollaboratior = (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { net_salary, final_salary, details } = req.body;

    //valido el roll
    try {
      let payment = new Payment();

      payment.administrator = req.user.id; //seteo al modelo.
      payment.collaborator = req.params.id;
      payment.net_salary = net_salary;
      payment.final_salary = final_salary;
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
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    let page = undefined;
    const collaboratorId = req.params.id;
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
      sort: { pay_day: "ascending" },
      limit: 5,
      page: page,
    };

    Payment.paginate(
      { collaborator: ObjectId(collaboratorId) },
      options,
      (err, payments) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            msg: "Error al hacer la consulta",
          });
        }

        if (!payments) {
          return res.status(404).send({
            status: "error",
            msg: "Sin pagos registrados",
          });
        }

        return res.status(200).json({
          status: "success",
          payments: {
            payments: payments.docs,
            count: payments.totalDocs,
            totalPages: payments.totalPages,
          },
        });
      }
    );
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const getPayments = (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
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
      sort: { pay_day: "ascending" },
      limit: 5,
      page: page,
    };

    Payment.paginate({}, options, (err, payments) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al hacer la consulta",
        });
      }

      if (!payments) {
        return res.status(404).send({
          status: "error",
          msg: "Sin pagos registrados",
        });
      }

      return res.status(200).json({
        status: "success",
        payments: {
          payments: payments.docs,
          count: payments.totalDocs,
          totalPages: payments.totalPages,
        },
      });
    });
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

module.exports = {
  registerSalaryCollaboratior,
  paymentsByCollaborator,
  getPayments,
};