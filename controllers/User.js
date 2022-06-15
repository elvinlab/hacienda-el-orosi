const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const { response } = require('express');
const { createToken } = require('../helpers/Jwt');

require('dotenv').config();

const register = async (req, res = response) => {
  if (req.user.role === 'Dueño') {
    const { document_id, password, email, name, surname, role } = req.body;

    try {
      let findUserByDocumentId = await User.findOne({ document_id });
      let findUserByEmail = await User.findOne({ email });

      if (findUserByDocumentId || findUserByEmail) {
        return res.status(400).json({
          status: false,
          msg: 'El administrador ya existe.'
        });
      }

      let user = new User();

      const salt = bcrypt.genSaltSync();

      user.document_id = document_id;
      user.password = bcrypt.hashSync(password, salt);
      user.email = email;
      user.name = name;
      user.surname = surname;
      user.role = role;

      await user.save();

      res.status(201).send({
        status: true,
        msg: 'Administrador registrado con éxito.',
        administrator: user
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        msg: 'Valores previamente registrados, volver a intentar.'
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const updateAdmin = async (req, res = response) => {
  const { document_id, email, name, surname } = req.body;

  const adminID = req.params.id;

  await User.findByIdAndUpdate(
    { _id: adminID },
    { document_id, email, name, surname },
    { new: true },
    (err, admin) => {
      if (err) {
        res.status(400).json({
          status: false,
          msg: 'Por favor contacté con un ING en Sistemas para más información.'
        });
      } else {
        res.status(200).send({
          status: true,
          msg: 'Datos de administrador actualizados con éxito.',
          admin: admin
        });
      }
    }
  );
};

const removeAdmin = async (req, res = response) => {
  if (req.user.role === 'Dueño') {
    let userId = req.params.id;

    let findUserByDocumentId = await User.findById({ _id: userId });

    if (findUserByDocumentId.role === 'Dueño') {
      return res.status(400).send({
        status: false,
        msg: 'No se puede eliminar al dueño de la Hacienda.'
      });
    }

    const findUserAndRole = await User.find({ role: 'Dueño' });

    if (findUserAndRole.length < 1) {
      return res.status(404).send({
        status: false,
        msg: 'No se puede estar sin dueño.'
      });
    }

    User.findOneAndDelete({ _id: userId }, (err, user) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: 'Error al solicitar la petición.'
        });
      }
      if (!user) {
        return res.status(404).send({
          status: false,
          msg: 'No se ha eliminado el administrador'
        });
      }
      return res.status(200).json({
        status: true,
        msg: 'Removido de forma con éxito',
        administrator: user
      });
    });
  } else {
    return res.status(400).send({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const login = async (req, res = response) => {
  const { document_id, password } = req.body;

  try {
    const findUser = await User.findOne({ document_id });

    if (!findUser) {
      return res.status(400).json({
        status: false,
        msg: 'Administrador no encontrado.'
      });
    }

    const validPassword = bcrypt.compareSync(password, findUser.password);

    if (!validPassword) {
      return res.status(400).json({
        status: false,
        msg: 'Contraseña incorrecta.'
      });
    }

    const token = await createToken(
      findUser._id,
      findUser.document_id,
      findUser.email,
      findUser.name,
      findUser.surname,
      findUser.role
    );

    return res.status(200).json({
      status: true,
      msg: 'Inicio de sesión correcto.',
      token: token,
      user: {
        id: findUser._id,
        document_id: findUser.document_id,
        email: findUser.email,
        name: findUser.name,
        surname: findUser.surname,
        role: findUser.role
      }
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      msg: 'Por favor contacté con un ING en Sistemas para más información.'
    });
  }
};

const getUser = async (req, res = response) => {
  let userId = req.user.id;

  await User.findById(userId).exec((err, get_user) => {
    if (err || !get_user) {
      return res.status(404).send({
        status: false,
        msg: 'No existe el usuario.'
      });
    }

    return res.status(200).send({
      status: true,
      msg: 'Datos obtenidos.',
      user: {
        id: get_user._id,
        document_id: get_user.document_id,
        email: get_user.email,
        name: get_user.name,
        surname: get_user.surname,
        role: get_user.role
      }
    });
  });
};

const set_recovery_key = async (req, res = response) => {
  const email = req.params.email;

  const token = Math.floor(Math.random() * (999999 - 100000) + 100000);

  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD_GMAIL
      }
    })
  );

  let mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Código de recuperación.',
    text: 'Su código de recuperacion es: ' + token
  };

  User.findOne({ email: email }, (err, get_user) => {
    if (err) {
      return res.status(500).send({
        status: false,
        msg: 'Error en el servidor.'
      });
    } else {
      if (!get_user) {
        return res.status(500).send({
          status: false,
          msg: 'El correo electrónico no se encuentra registrado, intente nuevamente.'
        });
      } else {
        User.findByIdAndUpdate({ _id: get_user._id }, { recovery_key: token }, (err) => {
          if (err) {
            return res.status(400).json({
              status: false,
              msg: 'Por favor contacté con un ING en Sistemas para más información.'
            });
          } else {
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }

          return res.status(200).send({
            status: true,
            msg: 'Por favor revisar su correo, se ha enviado un codigo de verificacion'
          });
        });
      }
    }
  });
};

const verify_recovery_key = async (req, res = response) => {
  let email = req.params['email'];
  let code = req.params['codigo'];

  User.findOne({ email: email }, (err, user) => {
    if (err || !user) {
      return res.status(500).send({ status: false, msg: 'Error en el servidor.' });
    } else {
      if (user.recovery_key == code) {
        return res.status(200).send({
          status: true,
          msg: 'Por favor prosiga a cambiar la contraseña.',
          token: true
        });
      } else {
        return res.status(400).send({
          status: false,
          msg: 'El codigo no es igual al enviado previamente.'
        });
      }
    }
  });
};

const change_password = async (req, res = response) => {
  const email = req.params.email;
  const { password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).send({ status: false, msg: 'Error en el servidor.' });
    } else {
      if (!user) {
        return res.status(500).send({
          status: false,
          msg: 'El correo electrónico no se encuentra registrado, intente nuevamente.'
        });
      } else {
        const salt = bcrypt.genSaltSync();
        hash = bcrypt.hashSync(password, salt);

        User.findByIdAndUpdate({ _id: user._id }, { password: hash, recovery_key: null }, (err) => {
          if (err) {
            return res.status(500).send({
              status: false,
              msg: 'Error en el servidor.'
            });
          }

          return res.status(200).send({
            status: true,
            msg: 'Contraseña actualizada con éxito.'
          });
        });
      }
    }
  });
};

const list_admins = (req, res = response) => {
  if (req.user.role === 'Dueño') {
    User.find().exec((err, admins) => {
      if (err) {
        return res.status(404).send({
          status: false,
          msg: 'Error al hacer la consulta.'
        });
      }

      return res.status(200).json({
        status: true,
        administrators: admins
      });
    });
  } else {
    return res.status(400).send({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const changeStatus = async (req, res = response) => {
  if (req.user.role === 'Dueño') {
    const { role } = req.body;
    const adminID = req.params.id;

    const findUserAndRole = await User.findById(adminID);

    console.log(req.user, findUserAndRole);
    if (req.user.id == findUserAndRole._id) {
      return res.status(404).send({
        status: false,
        msg: 'No se puede cambiar el cargo al dueño'
      });
    }

    await User.findByIdAndUpdate({ _id: adminID }, { role: role }, { new: true }, (err, admin) => {
      if (err) {
        return res.status(400).json({
          status: false,
          msg: 'Por favor contacté con un ING en Sistemas para más información.'
        });
      } else {
        return res.status(200).send({
          status: true,
          admin: admin,
          msg: 'Cargo de administador actualizado.'
        });
      }
    });
  } else {
    res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

module.exports = {
  login,
  register,
  getUser,
  set_recovery_key,
  verify_recovery_key,
  change_password,
  removeAdmin,
  list_admins,
  changeStatus,
  updateAdmin
};
