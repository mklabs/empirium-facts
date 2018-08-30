const debug = require('debug')('empifacts:facts');
const uuid = require('uuid/v4');
const Enmap = require('enmap');

// non-cached, auto-fetch enmap:
const facts = new Enmap({
  name: 'facts',
  autoFetch: true,
  fetchAll: false
});

const getFacts = async () => {
  await facts.defer;
  return await facts.fetchEverything();
};

const getFact = async id => {
  await facts.defer;
  return facts.find('id', id);
};

const addFact = async ({ content, name, author }) => {
  await facts.defer;

  debug('Adding fact with', { content, name, author });
  const id = uuid();

  facts.set(id, {
    id,
    content,
    name,
    author,
    date: new Date(),
    updated: new Date()
  });
};

const deleteFactWithId = async id => {
  await facts.defer;

  debug('Deleting fact with id', id);
  facts.delete(id);
};

const saveFact = async (id, { content, name, author }) => {
  await facts.defer;

  if (!fact) throw new Error('saveFact: missing fact');
  if (!name) throw new Error('saveFact: missing name');
  if (!author) throw new Error('saveFact: missing author');

  const existingObj = facts.find('id', id);
  if (!existingObj)
    throw new Error(`saveFact: unable to find fact with id "${id}"`);

  const props = Object.assign({}, existingObj, {
    fact,
    name,
    author,
    updated: new Date()
  });

  facts.set(id, props);
  return props;
};

module.exports = {
  getFacts,
  addFact,
  getFact,
  deleteFactWithId,
  saveFact
};
