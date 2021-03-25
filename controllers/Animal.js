const Animal = require("../models/Animal.js");
const { response } = require("express");

const register = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const administratorID = req.user.id;
    const {
      plate_number,
      type_animal,
      status,
      race,
      age,
      date_admission,
      daughter_of,
      starting_weight,
      place_origin,
      name,
      photo,
      photo_register,
      gender,
      next_due_date,
    } = req.body;

    try {
      let findAnimalByPlateNumber = await Animal.findOne({
        plate_number,
      });

      if (findAnimalByPlateNumber) {
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
      animal.starting_weight = starting_weight;
      animal.place_origin = place_origin;
      animal.name = name;
      animal.photo = photo;
      animal.photo_register = photo_register;
      animal.gender = gender;
      animal.next_due_date = next_due_date;

      await animal.save();

      return res.status(200).json({
        status: true,
        msg: `El animal con numero de chapa ${plate_number} fue registrado con exito`,
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
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const cowID = req.params.id;
    const {
      plate_number,
      type_animal,
      status,
      race,
      age,
      date_admission,
      daughter_of,
      starting_weight,
      place_origin,
      name,
      photo,
      photo_register,
      gender,
      next_due_date,
    } = req.body;

    const findAnimalByPlateNumber = await Animal.findOne({
      plate_number,
    });

    if (findAnimalByPlateNumber && findAnimalByPlateNumber._id != cowID) {
      return res.status(400).json({
        status: false,
        msg: "Ya existe un animal con este numero de chapa.",
      });
    }

    Animal.findByIdAndUpdate(
      { _id: cowID },
      {
        plate_number,
        type_animal,
        status,
        race,
        age,
        date_admission,
        daughter_of,
        starting_weight,
        place_origin,
        name,
        photo,
        photo_register,
        gender,
        next_due_date,
      },
      { new: true },
      (err, animal) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg:
              "Por favor contacte con un ingeniero en sistemas para mas información",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Datos del animal actualizados con exito",
            animal: animal,
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

const changeStatus = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { status } = req.body;
    const animalID = req.params.id;

    await Animal.findByIdAndUpdate(
      { _id: animalID },
      { status: status },
      { new: true },
      (err, animal) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg:
              "Por favor contacte con un ingeniero en sistemas para mas información",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Estado actualizado del animal",
            animal: animal,
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

const changeNextDueDate = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { next_due_date } = req.body;
    const animalID = req.params.id;

    await Animal.findByIdAndUpdate(
      { _id: animalID },
      { next_due_date },
      { new: true },
      (err, animal) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg:
              "Por favor contacte con un ingeniero en sistemas para mas información",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Fecha proxima del parto actualizada",
            animal: animal,
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

const getAnimals = (req, res = response) => {
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
    sort: { date_admission: -1 },
    limit: 10,
    page: page,
    populate: "administrator",
  };

  Animal.paginate({}, options, (err, animals) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        status: false,
        msg: "Error al hacer la consulta",
      });
    }

    return res.status(200).json({
      status: true,
      animals: {
        animals: animals.docs,
        total: animals.totalDocs,
      },
    });
  });
};

const getAnimalByType = (req, res = response) => {
  let type = req.params.type;
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
    sort: { date_admission: -1 },
    limit: 10,
    page: page,
    populate: "administrator",
  };

  Animal.paginate({ type_animal: type }, options, (err, animals) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        status: false,
        msg: "Error al hacer la consulta",
      });
    }

    return res.status(200).json({
      status: true,
      animals: {
        animalsType: type,
        animals: animals.docs,
        total: animals.totalDocs,
      },
    });
  });
};

const getAnimalByStatusAndType = (req, res = response) => {
  let type = req.params.type;
  let status = req.params.status;
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
    sort: { date_admission: -1 },
    limit: 10,
    page: page,
    populate: "administrator",
  };

  Animal.paginate({ type_animal: type, status }, options, (err, animals) => {
    if (err) {
      console.log(err);
      return res.status(500).send({
        status: false,
        msg: "Error al hacer la consulta",
      });
    }

    return res.status(200).json({
      status: true,
      animals: {
        animalsType: type,
        animals: animals.docs,
        total: animals.totalDocs,
      },
    });
  });
};

const findAnimalByPlateNumber = async (req, res = response) => {
  let plate_number = req.params.id;

  await Animal.findOne({ plate_number })
    .populate("administrator")
    .exec((err, animal) => {
      if (err || !animal) {
        return res.status(404).send({
          status: false,
          msg: "Animal no existe",
        });
      }
      return res.status(200).send({
        status: true,
        animal: animal,
      });
    });
};

module.exports = {
  register,
  update,
  changeStatus,
  changeNextDueDate,
  getAnimals,
  getAnimalByType,
  getAnimalByStatusAndType,
  findAnimalByPlateNumber,
};
