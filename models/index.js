const fs = require('fs');
const path = require('path');
const debug = require('debug')('empifacts:models');
const Sequelize = require('sequelize');

// Holder for models and connection
const db = {};

// Init DB here and import models.
//
// Note: This method is meant to be called on startup, so sync methods are okay.
const initDB = async config => {
  debug('Init DB on', config.DB_HOST);

  const dbLogger = require('debug')('empifacts:sequelize');
  const connection = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD,
    {
      host: config.DB_HOST,
      dialect: 'mssql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      },
      dialectOptions: {
        encrypt: true
      },

      logging: msg => dbLogger(msg)
    }
  );

  debug('Importing models');
  const files = fs.readdirSync(__dirname).filter(file => file !== 'index.js');
  debug('Models:', files);

  for (const file of files) {
    const model = connection.import(path.join(__dirname, file));
    db[model.name] = model;
  }

  try {
    await connection.authenticate();
  } catch (err) {
    console.error('Unable to connect to the database', err.message);
    throw err;
  }

  debug('Connection has been established successfully.');
  db.connection = connection;
  return {
    db,
    connection
  };
};

module.exports = {
  initDB,
  db
};
