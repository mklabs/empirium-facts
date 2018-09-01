const debug = require('debug')('empifacts:user');
const { db } = require('../models');

const getUser = async id => {
  const { User } = db;
  const user = await User.getUser(id);
  if (!user) {
    throw new Error(`getUser: unable to find user with id "${id}"`);
  }

  return user;
};

const getUsers = async () => {
  const { User } = db;
  return await User.getUsers();
};

const setUser = async (id, user) => {
  const { User } = db;

  if (!user) {
    throw new Error('setUser: missing user object');
  }

  const existingUser = await getUser(id);
  if (!existingUser) {
    throw new Error(`setUser: unable to find user with id "${id}"`);
  }

  return await User.setUser(id, user);
};

const findOrCreateUser = async profile => {
  const { User } = db;
  debug('find or create user "%s" (%s)', profile.displayName, profile.id);
  const user = await User.findOrCreateUser(profile);

  // todo: better way to handle administration
  if (user.displayName === 'Mickael Daniel (mklabs)') {
    user.admin = true;
  }

  return user;
};

module.exports = {
  setUser,
  getUser,
  getUsers,
  findOrCreateUser
};
