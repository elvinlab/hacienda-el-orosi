const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const { response } = require("express");
const { createToken } = require("../helpers/Jwt");

require("dotenv").config();

const register = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE") {
    const { document_id, password, email, name, surname, role } = req.body;

    try {
      let findUserByDocumentId = await User.findOne({ document_id });
      let findUserByEmail = await User.findOne({ email });

      if (findUserByDocumentId || findUserByEmail) {
        return res.status(400).json({
          status: "error",
          msg: "El administrador ya existe",
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

      console.log(user);

      await user.save();

      res.status(201).send({
        status: "success",
        msg: "Administrador registrado con exito",
        user: {
          document_id: user.document_id,
          email: user.email,
          name: user.given_name,
          surname: user.surname,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        msg: "Puede que estos valores ya se encuentren registrados",
      });
    }
  } else {
    return res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const updateRole = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE") {
    const { role } = req.body;
    const userId = req.params.id;

    await User.findByIdAndUpdate({ _id: userId }, { role: role }, (err) => {
      if (err) {
        res.status(400).json({
          status: "error",
          msg: "Por favor hable con el administrador",
        });
      } else {
        res.status(200).send({
          status: "success",
          msg: "Cargo actualizado para este administrador",
        });
      }
    });
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const removeAdmin = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE") {
    let userId = req.params.id;

    User.findOneAndDelete({ _id: userId }, (err, user) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al solicitar la peticion",
        });
      }
      if (!user) {
        return res.status(404).send({
          status: "error",
          msg: "No se ha eliminado el administrador",
        });
      }
      return res.status(200).json({
        status: "success",
        msg: "Removido de forma exitosa",
      });
    });
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const login = async (req, res = response) => {
  const { document_id, password } = req.body;

  try {
    const findUser = await User.findOne({ document_id });

    if (!findUser) {
      return res.status(400).json({
        status: "error",
        msg: "Administrador no encontrado",
      });
    }

    const validPassword = bcrypt.compareSync(password, findUser.password);

    if (!validPassword) {
      return res.status(400).json({
        status: "error",
        msg: "Password incorrecto",
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
      status: "success",
      msg: "Login correcto",
      token: token,
      user: {
        id: findUser._id,
        document_id: findUser.document_id,
        email: findUser.email,
        name: findUser.name,
        surname: findUser.surname,
        role: findUser.role,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      msg: "Por favor hable con el administrador",
    });
  }
};

const getUser = async (req, res = response) => {
  let userId = req.user.id;

  await User.findById(userId).exec((err, get_user) => {
    if (err || !get_user) {
      return res.status(404).send({
        status: "error",
        msg: "No existe el usuario",
      });
    }

    return res.status(200).send({
      status: "success",
      msg: "Datos obtenidos",
      user: {
        id: get_user._id,
        document_id: get_user.document_id,
        email: get_user.email,
        name: get_user.name,
        surname: get_user.surname,
        role: get_user.role,
      },
    });
  });
};

const set_recovery_key = async (req, res = response) => {
  const email = req.params.email;

  const token = Math.floor(Math.random() * (999999 - 100000) + 100000);

  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.PASSWORD_GMAIL,
      },
    })
  );

  let mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: "Código de recuperación.",
    text: "Su código de recuperacion es: " + token,
  };

  User.findOne({ email: email }, (err, get_user) => {
    if (err) {
      res.status(500).send({
        status: "error",
        msg: "Error en el servidor",
      });
    } else {
      if (!get_user) {
        res.status(500).send({
          status: "error",
          msg:
            "El correo electrónico no se encuentra registrado, intente nuevamente.",
        });
      } else {
        User.findByIdAndUpdate(
          { _id: get_user._id },
          { recovery_key: token },
          (err) => {
            if (err) {
              return res.status(400).json({
                status: "error",
                msg: "Por favor hable con el administrador",
              });
            } else {
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            }

            res.status(200).send({
              status: "success",
              msg:
                "Por favor revisar su correo, le hemos enviado un codigo de verificacion",
            });
          }
        );
      }
    }
  });
};

const verify_recovery_key = async (req, res = response) => {
  let email = req.params["email"];
  let code = req.params["codigo"];

  User.findOne({ email: email }, (err, user) => {
    if (err || !user) {
      res.status(500).send({ status: "error", msg: "Error en el servidor" });
    } else {
      if (user.recovery_key == code) {
        res.status(200).send({
          status: "success",
          msg: "Por favor prosiga a cambiar la contraseña",
          token: true,
        });
      } else {
        res.status(400).send({
          status: "error",
          msg: "El codigo no es igual al enviado previamente",
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
      res.status(500).send({ status: "error", msg: "Error en el servidor" });
    } else {
      if (!user) {
        res.status(500).send({
          status: "error",
          msg:
            "El correo electrónico no se encuentra registrado, intente nuevamente.",
        });
      } else {
        const salt = bcrypt.genSaltSync();
        hash = bcrypt.hashSync(password, salt);

        User.findByIdAndUpdate({ _id: user._id }, { password: hash }, (err) => {
          if (err) {
            res.status(500).send({
              status: "error",
              msg: "Error en el servidor",
            });
          }

          res.status(200).send({
            status: "success",
            msg: "Contraseña actualizada con exito",
          });
        });
      }
    }
  });
};

const list_admins = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE") {
    User.find().exec((err, admins) => {
      if (err || !admins) {
        return res.status(404).send({
          status: "error",
          msg: "Error inesperado",
        });
      }

      return res.status(200).json({
        status: "success",
        admins: admins,
      });
    });
  } else {
    return res.status(400).send({
      status: "error",
      msg: "No tienes permisos en la plataforma",
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
  updateRole,
  removeAdmin,
  list_admins,
};
