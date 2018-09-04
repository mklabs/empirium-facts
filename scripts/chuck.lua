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

local djezFacts = {
  "les oiseaux volent dans le ciel, si t'enlève l'air",
  "i'm aware",
  "j'ai fini debout sur le bureau!"
};

local oneForAllFacts = {
  "j'ai plus de meuf c'pour ça que ma RNG descend ?",
  "respectez moi mtn",
  "ptain la je me ferais bien livré une meuf des cigs un kebab et des lqe"
};

function chucksplit(msg)
  msg = msg or '';
  local words = {};
  for word in msg:gmatch("%w+") do table.insert(words, word) end;
  return words;
end;

function chucknorris(name, forWho)
  local facts = {};

  if forWho == 'djez' then
    facts = djezFacts;
  elseif forWho == 'oneforall' then
    facts = oneForAllFacts;
  else
    facts = chuckFacts;
  end

  local fact = facts[ math.random(#facts) ]
  if name then
    local msg, index = fact:gsub('Chuck Norris', name);
    return msg;
  else
    return fact;
  end
end;
