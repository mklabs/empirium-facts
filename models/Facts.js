const debug = require('debug')('empifacts:models:Fact');
const uuid = require('uuid/v4');
const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Fact = sequelize.define('Fact', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    content: {
      type: DataTypes.STRING
    },

    name: {
      type: DataTypes.STRING
    },

    author: {
      type: DataTypes.STRING
    }
  });

  Fact.getFacts = async () => {
    return await Fact.findAll();
  };

  Fact.getFact = async id => {
    return await Fact.findById(id);
  };

  Fact.addFact = async ({ content, name, author }) => {
    const id = uuid();
    debug('Fact.addFact: Adding fact with', { id, content, name, author });

    return await Fact.create({
      id,
      name,
      author,
      content
    });
  };

  return Fact;
};
