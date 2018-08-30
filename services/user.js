const debug = require('debug')('empifacts:user');
const uuid = require('uuid/v4');
const Enmap = require('enmap');

// non-cached, auto-fetch enmap:
const users = new Enmap({
  name: 'users',
  autoFetch: true,
  fetchAll: false
});

const getUsers = async () => {
  await users.defer;
  return users;
};

const getUser = async (id) => {
  await users.defer;

  const user = users.find('id', id);
  if (!user) throw new Error(`getUser: unable to find user with id "${id}"`);

  return user;
};

const setUser = async (id, user) => {
  await users.defer;

  if (!user) throw new Error('setFact: missing user object');

  const existingObj = users.find('id', id);
  if (!existingObj) throw new Error(`setUser: unable to find user with id "${id}"`);

  const props = Object.assign({}, existingObj, user, {
    updated: new Date()
  });

  users.set(id, props);
  return await users.find('id', id);
};

const findOrCreateUser = async (profile) => {
  await users.defer;

  debug('find or create user', profile);
  const existingUser = users.find('id', profile.id);
  if (existingUser) return existingUser;

  // not existing, create in db
  debug('User %s not existing, creating ...');
  users.set(profile.id, profile);

  // todo: better way to handle administration
  const user = await users.get(profile.id);
  if (user.displayName === 'Mickael Daniel (mklabs)') {
    user.admin = true;
  }

  return user;
};

module.exports = {
  getUsers,
  getUser,
  setUser,
  findOrCreateUser
};
