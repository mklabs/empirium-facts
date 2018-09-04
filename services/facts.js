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

const buildLua = async () => {
  const { Fact } = db;
  const items = (await getFacts()).map(fact => fact.dataValues);

  const luaFacts = new Map();
  for (const item of items) {
    const existing = luaFacts.get(item.name) || [];
    existing.push(item);
    luaFacts.set(item.name, existing);
  }

  let lua = `
local chuckFacts = {
  "Chuck Norris a déjà compté jusqu'à l'infini. Deux fois.",
  "Google, c'est le seul endroit où tu peux taper Chuck Norris...",
  "Certaines personnes portent un pyjama Superman. Superman porte un pyjama Chuck Norris.",
  "Chuck Norris donne fréquemment du sang à la Croix-Rouge. Mais jamais le sien.",
  "Chuck Norris et Superman ont fait un bras de fer, le perdant devait mettre son slip par dessus son pantalon.",
  "Chuck Norris ne se mouille pas, c'est l'eau qui se Chuck Norris.",
  "Chuck Norris peut gagner une partie de puissance 4 en trois coups.",
  "Un jour, Chuck Norris a perdu son alliance. Depuis c'est le bordel dans les terres du milieu...",
  "Chuck Norris ne porte pas de montre. Il décide de l'heure qu'il est.",
  "La seule chose qui arrive à la cheville de Chuck Norris... c'est sa chaussette.",
  "Chuck Norris fait pleurer les oignons.",
  "Dieu a dit: que la lumiere soit! et Chuck Norris répondit : On dit s'il vous plait.",
  "Chuck Norris peut diviser par zéro.",
  "Chuck Norris comprend Jean-Claude Van Damme.",
  "Chuck Norris joue à la roulette russe avec un chargeur plein.",
  "Les suisses ne sont pas neutres, ils attendent de savoir de quel coté Chuck Norris se situe.",
  "Chuck Norris sait parler le braille.",
  "Quand Chuck Norris s'est mis au judo, David Douillet s'est mis aux pièces jaunes."
};

  `;

  for (const [name, facts] of luaFacts) {
    lua += `\n\nlocal ${name}Facts = {
      ${facts
        .map((fact, index) => {
          const comma = index + 1 === facts.length ? '' : ',';
          const indent = index === 0 ? '' : '      ';
          return `${indent}"${fact.content}"${comma}`;
        })
        .join('\n')}
    };`;
  }

  lua = lua.replace(/^\s\s\s\s/gim, '');

  lua += `

function chucksplit(msg)
  msg = msg or '';
  local words = {};
  for word in msg:gmatch("%w+") do table.insert(words, word) end;
  return words;
end;

function chucknorris(name, forWho)
  local facts = {};
  `;

  let iterations = 0;
  for (const [name, facts] of luaFacts) {
    const whatelse = iterations === 0 ? '' : 'else';
    iterations = iterations + 1;

    lua += `${whatelse}if forWho == '${name}' then
      facts = ${name}Facts;
    `;
  }

  lua = lua.replace(/^\s\s\s\s/gim, '  ');

  lua += `else
    facts = chuckFacts;
  end
  `;

  lua += `

  local fact = facts[ math.random(#facts) ];
  if name then
    local msg, index = fact:gsub('Chuck Norris', name);
    return msg;
  else
    return fact;
  end
end;
  `;

  console.log(lua);
  return lua;
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
  buildLua,
  getFacts,
  addFact,
  getFact,
  deleteFactWithId
};
