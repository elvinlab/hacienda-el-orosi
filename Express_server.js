const express = require('express');
const path = require('path');

const { dbConnection } = require('./database/Config.js');

require('dotenv').config();

const cors = require('cors');

const app = express();

dbConnection();

app.use(cors());

app.use(express.json());

//Static file declaration
app.use(express.static(path.join(__dirname, '/public')));
//production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/public')));
  //
  app.get('*', (req, res) => {
    res.sendFile(path.join((__dirname = '/public/index.html')));
  });
}
//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use('/api', require('./routes/User.js'));
app.use('/api/recursos-humanos', require('./routes/Collaborator.js'));
app.use('/api/recursos-humanos', require('./routes/Job.js'));
app.use('/api/recursos-humanos', require('./routes/Lend.js'));
app.use('/api/recursos-humanos', require('./routes/Payment.js'));
app.use('/api/recursos-humanos', require('./routes/Contract.js'));
app.use('/api/gestion-animal', require('./routes/Animal.js'));
app.use('/api/gestion-animal', require('./routes/Diet.js'));
app.use('/api/gestion-animal', require('./routes/Product.js'));
app.use('/api/gestion-salud', require('./routes/Medicament.js'));
app.use('/api/gestion-salud', require('./routes/Health.js'));
app.use('/api/gestion-venta', require('./routes/Sale.js'));
app.use('/api/herramientas', require('./routes/Tool.js'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});

module.exports = app;
