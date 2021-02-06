const jwt = require("jwt-simple");
const moment = require("moment");

exports.createToken = function (_id, document_id, email, name, surname, role) {
  let payload = {
    id: _id,
    document_id: document_id,
    email: email,
    name: name,
    surname: surname,
    role: role,
    iat: moment().unix(),
    exp: moment().add(5, "days").unix,
  };

  return jwt.encode(payload, process.env.SECRET_JWT_SEED);
};
