const debug = require('debug')('empifacts:facts');
const { db } = require('../models');

const getFact = async id => {
  const { Fact } = db;
  const fact = await Fact.getfact(id);
  if (!fact) {
    throw new Error(`getFact: unable to find fact with id "${id}"`);
  }

  return fact;
};

const getFacts = async () => {
  const { Fact } = db;
  return await Fact.getFacts();
};

const addFact = async ({ content, name, author }) => {
  const { Fact } = db;

  debug('Adding fact with', { content, name, author });

  const fact = await Fact.addFact({ content, name, author });
  return fact.dataValues;
};

const deleteFactWithId = async id => {
  const { Fact } = db;

  debug('Deleting fact with id', id);
  const fact = await getFact(id);
  return await fact.destroy();
};

module.exports = {
  getFacts,
  addFact,
  getFact,
  deleteFactWithId
};
