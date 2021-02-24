const express = require("express");
const { dbConnection } = require("./database/Config.js");

require("dotenv").config();

const cors = require("cors");

const app = express();

dbConnection();

app.use(cors());

app.use(express.static("public"));
app.use(express.json());

app.use("/api", require("./routes/User.js"));
app.use("/api/recursos-humanos", require("./routes/Collaborator.js"));
app.use("/api/recursos-humanos", require("./routes/Job.js"));
app.use("/api/recursos-humanos", require("./routes/Lend.js"));
app.use("/api/recursos-humanos", require("./routes/Payment.js"));
app.use("/api/recursos-humanos", require("./routes/Contract.js"));

//Herramientas
app.use("/api/herramientas", require("./routes/Tool.js"));

app.listen(process.env.PORT, () => {
  console.log(`Servidor correindo en el puerto: ${process.env.PORT}`);
});

module.exports = app;
