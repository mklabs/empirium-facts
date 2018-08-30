const { getFacts, saveFact, addFact, deleteFactWithId } = require('./facts');
const { setUser, getUsers, getUser, findOrCreateUser } = require('./user');

module.exports = {
  getFacts,
  addFact,
  saveFact,
  setUser,
  getUser,
  getUsers,
  deleteFactWithId,
  findOrCreateUser
};
