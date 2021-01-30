const express = require("express");
const { dbConnection } = require("./database/Config.js");

require("dotenv").config();

const cors = require("cors");

const app = express();

dbConnection();

app.use(express.static("public"));
app.use(express.json());
app.use("/api/recursos-humanos", require("./routes/Collaborator.js"));
app.use("/api/recursos-humanos", require("./routes/Job.js"));

app.listen(process.env.PORT, () => {
  console.log(`Servidor correindo en el puerto: ${process.env.PORT}`);
});

module.exports = app;
