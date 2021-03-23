const Payment = require("../models/Payment.js");
const Presence = require("../models/Presence.js");
const moment = require("moment");

const { response } = require("express");
const { ObjectId } = require("mongodb");

const registerSalaryCollaborator = (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const { paymentReg } = req.body;
    const collaboratorId = req.params.id;

    if (paymentReg.final_salary === 0) {
      return res.status(400).json({
        status: true,
        msg: "No se puede registrar un pago con un salario final igual a cero ",
      });
    }
    try {
      Presence.updateMany(
        { status: "Pendiente", collaborator: ObjectId(collaboratorId) },
        { status: "paid" },
        function (err) {
          if (err) {
            return res.status(500).json({
              status: true,
              error: `Contacte a un ingeniero: ${err}`,
            });
          }
        }
      );

      let payment = new Payment();

      payment.administrator = req.user.id;
      payment.collaborator = collaboratorId;
      payment.invoice_number = Math.floor(
        Math.random() * (999999 - 100000) + 100000
      );
      payment.collaborator_job_name = paymentReg.collaborator_job_name;
      payment.total_days_worked = paymentReg.total_days_worked;
      payment.total_hours_worked = paymentReg.total_hours_worked;
      payment.total_extra_hours_price = paymentReg.total_extra_hours_price;
      payment.extra_hours_price = paymentReg.extra_hours_price;
      payment.price_day = paymentReg.price_day;
      payment.net_salary = paymentReg.net_salary;
      payment.total_salary = paymentReg.total_salary;

      payment.save();
      return res.status(200).json({
        status: true,
        msg: "Pago realizado con exito",
      });
    } catch (error) {
      return res.status(500).json({
        status: true,
        msg: "Porfavor contacte con el Administrador para mas información",
      });
    }
  } else {
    return res.status(400).json({
      status: true,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const paymentsByCollaborator = (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
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
            status: true,
            msg: "Error al hacer la consulta",
          });
        }

        if (!payments) {
          return res.status(404).send({
            status: true,
            msg: "Sin pagos registrados",
          });
        }

        return res.status(200).json({
          status: true,
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
      status: true,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const getPayments = (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
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
          status: true,
          msg: "Error al hacer la consulta",
        });
      }

      if (!payments) {
        return res.status(404).send({
          status: true,
          msg: "Sin pagos registrados",
        });
      }

      return res.status(200).json({
        status: true,
        payments: {
          payments: payments,
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

const registerPresence = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const { total_overtime } = req.body;
    const collaboratorId = req.params.id;

    try {
      let dateTime = new Date();

      let findPresenceByActualDateAndCollaborator = await Presence.findOne({
        date: moment(dateTime).format("YYYY-MM-DD"),
        collaborator: ObjectId(collaboratorId),
      });

      if (findPresenceByActualDateAndCollaborator) {
        return res.status(400).json({
          status: true,
          msg: "Dia laboral ya registrado para el colaborador",
        });
      }

      let presence = new Presence();

      presence.administrator = req.user.id;
      presence.collaborator = collaboratorId;
      presence.total_overtime = total_overtime;

      await presence.save();

      return res.status(200).json({
        status: true,
        msg: "Se registro dia laboral con exito",
      });
    } catch (error) {
      return res.status(500).json({
        status: true,
        msg: "Porfavor contacte con el Administrador para mas información",
      });
    }
  } else {
    res.status(400).json({
      status: true,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const getDayPendingByCollaborator = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const collaboratorId = req.params.id;

    let findPresenceByStatusAndByCollaborator = await Presence.find({
      status: "Pendiente",
      collaborator: ObjectId(collaboratorId),
    }).sort({ date: -1 });

    await Presence.aggregate(
      [
        {
          $match: {
            status: { $eq: "Pendiente" },
            collaborator: { $eq: ObjectId(collaboratorId) },
          },
        },
        { $group: { _id: null, amount: { $sum: "$total_overtime" } } },
      ],
      function (result) {
        return res.status(200).json({
          status: true,
          total_overtime: result[0] ? result[0].amount : 0,
          pending_days: findPresenceByStatusAndByCollaborator,
        });
      }
    );
  } else {
    res.status(400).json({
      status: true,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

module.exports = {
  registerSalaryCollaborator,
  paymentsByCollaborator,
  getPayments,
  registerPresence,
  getDayPendingByCollaborator,
};
