const debug = require('debug')('empifacts:routes');
const {
  getFacts,
  getFact,
  addFact,
  deleteFactWithId
} = require('../services/service');

const index = async (req, res, next) => {
  debug('Render index page');

  const items = await getFacts();
  const facts = items.slice(0, 10);
  res.render('index', { facts, user: await req.user });
};

const facts = async (req, res, next) => {
  debug('Render facts page..');
  const facts = await getFacts();
  res.render('facts', { facts, user: await req.user });
};

const addFacts = async (req, res, next) => {
  debug('Adding fact with', req.body);
  const user = await req.user;
  if (!user) throw new Error('Utilisateur non identifié');

  const props = { ...req.body, author: user.displayName };
  const errors = [];
  if (!props.name) errors.push('Le nom est manquant');
  if (!props.content) errors.push('Le contenu du fact est manquant');

  if (!errors.length) {
    await addFact(props);
  }

  res.render('addFacts', {
    user,
    props,
    errors,
    msg: errors.length
      ? 'Erreur, fact non ajouté veuillez vérifier les erreurs ci-desous.'
      : `Fact "${props.content}" correctement ajouté pour ${props.name}.`
  });
};

const deleteFacts = async (req, res, next) => {
  const user = await req.user;
  const { id } = req.params;
  debug('Deleting fact with id: ', id);

  if (!id) throw new Error('Missing ID');
  await deleteFactWithId(id);

  res.redirect('/facts');
};

const renderAddFacts = async (req, res, next) => {
  debug('Render add facts page');
  res.render('addFacts', { user: await req.user });
};

const renderApi = async (req, res, next) => {
  debug('Render api page');
  res.render('api', { user: await req.user });
};

const login = async (req, res, next) => {
  debug('Render login page');
  res.render('login', { user: await req.user });
};

const logout = async (req, res, next) => {
  req.logout();
  res.redirect('/');
};

const cgu = async (req, res, next) => {
  debug('Show CGU');
  res.render('cgu', { user: await req.user });
};

module.exports = {
  addFacts,
  renderAddFacts,
  deleteFacts,
  renderApi,
  index,
  login,
  logout,
  facts,
  cgu
};
