const { getFacts, saveFact, addFact, buildLua, deleteFactWithId } = require('./facts');
const { setUser, getUsers, getUser, findOrCreateUser } = require('./user');

module.exports = {
  buildLua,
  getFacts,
  addFact,
  saveFact,
  setUser,
  getUser,
  getUsers,
  deleteFactWithId,
  findOrCreateUser
};
