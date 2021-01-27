const express = require('express');
const { dbConnection } = require('./database/Config.js');

require('dotenv').config();

const cors = require('cors');

const app = express();

app.use( express.static('public'));
app.use( express.json());

dbConnection();

app.listen( process.env.PORT, () => {
    console.log(`Servidor correindo en el puerto: ${ process.env.PORT }` )
} );

module.exports = app;