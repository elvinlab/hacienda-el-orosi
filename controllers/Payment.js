const Payment = require('../models/Payment.js');
const Presence = require('../models/Presence.js');
const moment = require('moment');

const { response } = require('express');
const { ObjectId } = require('mongodb');

const registerSalaryCollaborator = (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Recursos Humanos') {
    const { paymentReg } = req.body;
    const collaboratorId = req.params.id;

    if (paymentReg.final_salary === 0) {
      return res.status(400).json({
        status: false,
        msg: 'No se puede registrar un pago con un salario final igual a cero.'
      });
    }
    try {
      Presence.updateMany(
        { status: 'Pendiente', collaborator: ObjectId(collaboratorId) },
        { status: 'Pagado' },
        function (err) {
          if (err) {
            return res.status(500).json({
              status: false,
              error: `Contacte a un ingeniero: ${err}`
            });
          }
        }
      );

      let payment = new Payment();

      payment.administrator = req.user.id;
      payment.collaborator = collaboratorId;
      payment.invoice_number = Math.floor(Math.random() * (999999 - 100000) + 100000);
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
        msg: 'Pago realizado con éxito.'
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: 'Por favor contacté con un ING en Sistemas para más información'
      });
    }
  } else {
    return res.status(400).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const paymentsByCollaborator = (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Recursos Humanos') {
    const collaboratorId = req.params.id;

    Payment.find({ collaborator: ObjectId(collaboratorId) }, (err, payments) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: 'Error al hacer la consulta'
        });
      }

      if (!payments) {
        return res.status(404).send({
          status: false,
          msg: 'No se encuentran pagos registrados.'
        });
      }

      return res.status(200).json({
        status: true,
        payments: payments
      });
    }).populate('collaborator');
  } else {
    res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const getPayments = (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Recursos Humanos') {
    Payment.find((err, payments) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: 'Error al hacer la consulta.'
        });
      }

      if (!payments) {
        return res.status(404).send({
          status: false,
          msg: 'No se encuentran pagos registrados.'
        });
      }

      return res.status(200).json({
        status: true,
        payments: payments
      });
    }).populate('collaborator');
  } else {
    res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const registerPresence = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Recursos Humanos') {
    const { total_overtime } = req.body;
    const collaboratorId = req.params.id;

    try {
      let dateTime = new Date();

      let findPresenceByActualDateAndCollaborator = await Presence.findOne({
        date: moment(dateTime).format('YYYY-MM-DD'),
        collaborator: ObjectId(collaboratorId)
      });

      if (findPresenceByActualDateAndCollaborator) {
        return res.status(400).json({
          status: false,
          msg: 'Este día ya se le registro al colaborador.'
        });
      }

      let presence = new Presence();

      presence.administrator = req.user.id;
      presence.collaborator = collaboratorId;
      presence.total_overtime = total_overtime;

      await presence.save();

      return res.status(200).json({
        status: true,
        msg: 'Día laboral registrado con éxito.'
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: 'Por favor contacté con un ING en Sistemas para más información.'
      });
    }
  } else {
    res.status(400).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const getDayPendingByCollaborator = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Recursos Humanos') {
    const collaboratorId = req.params.id;

    let findPresenceByStatusAndByCollaborator = await Presence.find({
      status: 'Pendiente',
      collaborator: ObjectId(collaboratorId)
    }).sort({ date: -1 });

    let total_overtime = 0;
    findPresenceByStatusAndByCollaborator.forEach(function (e) {
      total_overtime += e.total_overtime;
    });

    return res.status(200).json({
      status: true,
      total_overtime: total_overtime,
      pending_days: findPresenceByStatusAndByCollaborator
    });
  } else {
    res.status(400).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

module.exports = {
  registerSalaryCollaborator,
  paymentsByCollaborator,
  getPayments,
  registerPresence,
  getDayPendingByCollaborator
};
