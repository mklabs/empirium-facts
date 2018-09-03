const debug = require('debug')('empifacts:models:User');
const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },

    displayName: {
      type: DataTypes.STRING
    },

    photo: {
      type: DataTypes.STRING
    },

    gender: {
      type: DataTypes.STRING
    },

    provider: {
      type: DataTypes.STRING
    }
  });

  User.getUsers = async () => {
    return await User.findAll();
  };

  User.getUser = async id => {
    return await User.findById(id);
  };

  // todo: not used yet
  User.setUser = async (id, profile) => {
    if (!id) {
      throw new Error(
        'setUser: Missing ID, will be unable to find instance of User'
      );
    }

    if (!displayName) {
      throw new Error(
        'setUser: Missing ID, will be unable to find instance of User'
      );
    }

    const user = await User.getUser(id);
    if (!user) throw new Error(`setUser: unable to find user with ID "${id}"`);

    user.build(profile);
    const photo = profile.photos[0];
    if (photo) {
      user.set('photo', photo.value);
    }
    return await user.save();
  };

  // - profile: is the response of social platforms when logging in, as describe
  // by the schema standard.
  User.findOrCreateUser = async profile => {
    debug('User.findOrCreateUser: Create user "%s" (%s)', profile.displayName, profile.id);
    const defaults = { ...profile };
    if (profile.photos) {
      const photo = profile.photos[0];
      defaults.photo = photo ? photo.value : '';
    } else {
      defaults.photo = '';
    }

    const [ instance, created ] = await User.findOrCreate({
      where: {
        id: profile.id
      },

      defaults
    });

    debug('User.findOrCreateUser: User created (%s). Instance:', created, instance.dataValues);
    return instance;
  };

  return User;
};
