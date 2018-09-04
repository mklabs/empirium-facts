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

local CareydasFacts = {
  "i'm aware",
  "les oiseaux volent dans le ciel, si t'enlève l'air",
  "j'ai fini debout sur le bureau!"
};

local OneforallFacts = {
  "maintenant que j'ai un lqe je suis un homme nouveau",
  "ptain la je me ferais bien livré une meuf des cigs un kebab et des lqe",
  "respectez moi mtn",
  "Heal, regen, je vais pull comme un fdp, donc sors toi les doigts du cul !",
  "j'ai eu pdt genre 3 secondes une envie de jouer chasseur, heureusement c'est vite parti",
  "Mais bon, me coucher et rien loot alors que je peux tryhard jusqu'a epuisement et rien avoir.",
  "j'ai plus de meuf c'pour ça que ma RNG descend ?"
};

local TreevorFacts = {
  "D'ou je suis un guignol"
};

local YingFacts = {
  "C'est normal que le seul doodle que je connaisse c'est doodle jump ? :("
};

local DjosephuxFacts = {
  "Alors, le coca ou la coca?"
};

function chucksplit(msg)
  msg = msg or '';
  local words = {};
  for word in msg:gmatch("%w+") do table.insert(words, word) end;
  return words;
end;

function chucknorris(name, forWho)
  local facts = {};
  if forWho == 'Careydas' then
    facts = CareydasFacts;
  elseif forWho == 'Oneforall' then
    facts = OneforallFacts;
  elseif forWho == 'Treevor' then
    facts = TreevorFacts;
  elseif forWho == 'Ying' then
    facts = YingFacts;
  elseif forWho == 'Djosephux' then
    facts = DjosephuxFacts;
  else
    facts = chuckFacts;
  end


  local fact = facts[ math.random(#facts) ];
  if name then
    local msg, index = fact:gsub('Chuck Norris', name);
    return msg;
  else
    return fact;
  end
end;

function chuckChatMessage(message, channel, receiver)
  if channel == 'WHISPER' then
    return SendChatMessage(message, channel, nil, receiver);
  end;

  return SendChatMessage(message, channel);
end;

function chuckCommands(msg, channel, author)
  -- Only respond to !chucknorris command
  if msg == '!chucknorris' then
    local fact = chucknorris();
    return chuckChatMessage(fact, channel, author);
  end

  -- Or !chuck
  if msg == '!chuck' then
    local fact = chucknorris(author);
    return chuckChatMessage(fact, channel, author);
  end

  -- Djez aka Careydas
  if msg == '!djez' or msg == '!careydas' then
    local fact = chucknorris(author, 'Careydas');
    return chuckChatMessage(fact, channel, author);
  end

  if msg == '!one' or msg == '!oneforall' then
    local fact = chucknorris(author, 'Oneforall');
    return chuckChatMessage(fact, channel, author);
  end
end;

function chuckHelp(msg, channel, author)
  if msg == '!help' then
    chuckChatMessage('Empirium Facts Help:', channel, author);
    chuckChatMessage(' !help - Show this help message', channel, author);
    chuckChatMessage(' !chucknorris <name> - Random Chuck Norris fact avec nom optionnel', channel, author);
    chuckChatMessage(' !chuck <name> - Alias de !chucknorris', channel, author);
    chuckChatMessage(' !careydas or !djez - Careydas random facts', channel, author);
    chuckChatMessage(' !oneforall or !one - Oneforall random facts', channel, author);
    return;
  end;
end;
