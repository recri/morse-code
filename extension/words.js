/* -*- mode: js; tab-width: 8 -*- */
/*
  Copyright (C) 2015 by Roger E Critchlow Jr, Santa Fe, NM, USA.

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307 USA
*/

/*
** the source and license for this package may be found at github/recri/morse-code
** see README.org at that repo for documentation.
*/

/*
** routines for creating dictionaries of words for morse code training.
** a dictionary is just a word_list with the words sorted in order of difficulty.
** the difficulty is just the number of dits in the morse code representation of
** the word, and words may have spaces in them, ie be multiple words.
*/

//
// an arbitrary word list in any order
//
function word_list(name, words, table) {
    //
    // take the word list and sort into order of difficulty, dit length,
    //
    var word_list = {
	length : words.length,
	dits : null,
	order : null,
	min : 0,
	max : 0,
	next_i : 0,
	how_many_more : function() { return word_list.length - word_list.next_i; },
	any_more : function() { return word_list.how_many_more() > 0; },
	ditLength : function(word) { return table.ditLength(word); },
	startAt : function(i) { word_list.next_i = i; },
	next : function(n) {
	    n = Math.min(word_list.length-word_list.next_i, n);
	    var next = new Array(n);
	    for (var i = 0; i < n; i += 1) next[i] = words[order[word_list.next_i++]];
	    return next;
	},
    };
    var dits = word_list.dits = new Uint8Array(word_list.length);
    var order = word_list.order = new Uint16Array(word_list.length);
    var min = 128, max = 0;
    for (var i in words) {
	dits[i] = table.ditLength(words[i]);
	min = Math.min(dits[i], min);
	max = Math.max(dits[i], max);
    }
    var x = 0;
    for (var i = min; i <= max; i += 1) {
	var n_at_i = 0;
	for (var j in dits) {
	    if (dits[j] == i) {
		n_at_i += 1;
		order[x++] = j;
	    }
	}
    }
    return word_list;
}

//
// VOA special english vocabulary
//
function word_list_voa(table) {
    var words = [
	"a", "an", "able", "about", "above", "abuse", "accept", "accident", "accuse", "across",
	"act", "activist", "actor", "add", "administration", "admit", "adult", "advertise", "advise", "affect",
	"afraid", "after", "again", "against", "age", "agency", "aggression", "ago", "agree", "agriculture",
	"aid", "aim", "air", "air force", "airplane", "airport", "album", "alcohol", "alive", "all",
	"ally", "almost", "alone", "along", "already", "also", "although", "always", "ambassador", "amend",
	"ammunition", "among", "amount", "anarchy", "ancestor", "ancient", "and", "anger", "animal", "anniversary",
	"announce", "another", "answer", "any", "apologize", "appeal", "appear", "appoint", "approve", "archeology",
	"area", "argue", "arms", "army", "around", "arrest", "arrive", "art", "artillery", "as",
	"ash", "ask", "assist", "astronaut", "astronomy", "asylum", "at", "atmosphere", "attach", "attack",
	"attempt", "attend", "attention", "automobile", "autumn", "available", "average", "avoid", "awake", "award",
	"away", "baby", "back", "bad", "balance", "ball", "balloon", "ballot", "ban", "bank",
	"bar", "barrier", "base", "battle", "be", "beat", "beauty", "because", "become", "bed",
	"before", "begin", "behavior", "behind", "believe", "belong", "below", "best", "betray", "better",
	"between", "big", "bill", "biology", "bird", "bite", "black", "blame", "bleed", "blind",
	"block", "blood", "blow", "blue", "boat", "body", "boil", "bomb", "bone", "book",
	"border", "born", "borrow", "both", "bottle", "bottom", "box", "boy", "boycott", "brain",
	"brave", "bread", "break", "breathe", "bridge", "brief", "bright", "bring", "broadcast", "brother",
	"brown", "budget", "build", "building", "bullet", "burn", "burst", "bury", "bus", "business",
	"busy", "but", "buy", "by", "cabinet", "call", "calm", "camera", "camp", "campaign",
	"can", "cancel", "cancer", "candidate", "capital", "capture", "car", "care", "career", "careful",
	"carry", "case", "cat", "catch", "cause", "ceasefire", "celebrate", "center", "century", "ceremony",
	"chairman", "champion", "chance", "change", "charge", "chase", "cheat", "cheer", "chemicals", "chemistry",
	"chief", "child", "children", "choose", "circle", "citizen", "city", "civilian", "civil rights", "claim",
	"clash", "class", "clean", "clear", "clergy", "climate", "climb", "clock", "close", "cloth",
	"clothes", "cloud", "coal", "coalition", "coast", "coffee", "cold", "collapse", "collect", "college",
	"colony", "color", "combine", "come", "command", "comment", "committee", "common", "communicate", "community",
	"company", "compare", "compete", "complete", "complex", "compromise", "computer", "concern", "condemn", "condition",
	"conference", "confirm", "conflict", "congratulate", "Congress", "connect", "conservative", "consider", "constitution", "contact",
	"contain", "container", "continent", "continue", "control", "convention", "cook", "cool", "cooperate", "copy",
	"corn", "correct", "corruption", "cost", "cotton", "count", "country", "court", "cover", "cow",
	"crash", "create", "creature", "credit", "crew", "crime", "criminal", "crisis", "criticize", "crops",
	"cross", "crowd", "crush", "cry", "culture", "cure", "curfew", "current", "custom", "customs",
	"cut", "dam", "damage", "dance", "danger", "dark", "date", "daughter", "day", "dead",
	"deaf", "deal", "debate", "debt", "decide", "declare", "decrease", "deep", "defeat", "defend",
	"deficit", "define", "degree", "delay", "delegate", "demand", "democracy", "demonstrate", "denounce", "deny",
	"depend", "deplore", "deploy", "depression", "describe", "desert", "design", "desire", "destroy", "detail",
	"detain", "develop", "device", "dictator", "die", "diet", "different", "difficult", "dig", "dinner",
	"diplomat", "direct", "direction", "dirt", "disappear", "disarm", "disaster", "discover", "discrimination", "discuss",
	"disease", "dismiss", "dispute", "dissident", "distance", "dive", "divide", "do", "doctor", "document",
	"dog", "dollar", "donate", "door", "double", "down", "dream", "drink", "drive", "drop",
	"drown", "drug", "dry", "during", "dust", "duty", "each", "early", "earn", "earth",
	"earthquake", "ease", "east", "easy", "eat", "ecology", "economy", "edge", "education", "effect",
	"effort", "egg", "either", "elect", "electricity", "embassy", "embryo", "emergency", "emotion", "employ",
	"empty", "end", "enemy", "energy", "enforce", "engine", "engineer", "enjoy", "enough", "enter",
	"environment", "equal", "equipment", "escape", "especially", "establish", "estimate", "ethnic", "evaporate", "even",
	"event", "ever", "every", "evidence", "evil", "exact", "examine", "example", "excellent", "except",
	"exchange", "excuse", "execute", "exercise", "exile", "exist", "expand", "expect", "expel", "experience",
	"experiment", "expert", "explain", "explode", "explore", "export", "express", "extend", "extra", "extraordinary",
	"extreme", "extremist", "face", "fact", "factory", "fail", "fair", "fall", "false", "family",
	"famous", "fan", "far", "farm", "fast", "fat", "father", "favorite", "fear", "federal",
	"feed", "feel", "female", "fence", "fertile", "few", "field", "fierce", "fight", "fill",
	"film", "final", "financial", "find", "fine", "finish", "fire", "fireworks", "firm", "first",
	"fish", "fit", "fix", "flag", "flat", "flee", "float", "flood", "floor", "flow",
	"flower", "fluid", "fly", "fog", "follow", "food", "fool", "foot", "for", "force",
	"foreign", "forest", "forget", "forgive", "form", "former", "forward", "free", "freedom", "freeze",
	"fresh", "friend", "frighten", "from", "front", "fruit", "fuel", "full", "fun", "funeral",
	"future", "gain", "game", "gas", "gather", "general", "generation", "genocide", "gentle", "get",
	"gift", "girl", "give", "glass", "go", "goal", "god", "gold", "good", "goods",
	"govern", "government", "grain", "grass", "gray", "great", "green", "grind", "ground", "group",
	"grow", "guarantee", "guard", "guerrilla", "guide", "guilty", "gun", "hair", "half", "halt",
	"hang", "happen", "happy", "hard", "harm", "harvest", "hat", "hate", "have", "he",
	"head", "headquarters", "heal", "health", "hear", "heat", "heavy", "helicopter", "help", "here",
	"hero", "hide", "high", "hijack", "hill", "history", "hit", "hold", "hole", "holiday",
	"holy", "home", "honest", "honor", "hope", "horrible", "horse", "hospital", "hostage", "hostile",
	"hot", "hotel", "hour", "house", "how", "however", "huge", "human", "humor", "hunger",
	"hunt", "hurry", "hurt", "husband", "I", "ice", "idea", "identify", "if", "ignore",
	"illegal", "imagine", "immediate", "immigrant", "import", "important", "improve", "in", "incident", "incite",
	"include", "increase", "independent", "individual", "industry", "infect", "inflation", "influence", "inform", "information",
	"inject", "injure", "innocent", "insane", "insect", "inspect", "instead", "instrument", "insult", "intelligence",
	"intelligent", "intense", "interest", "interfere", "international", "Internet", "intervene", "invade", "invent", "invest",
	"investigate", "invite", "involve", "iron", "island", "issue", "it", "jail", "jewel", "job",
	"join", "joint", "joke", "judge", "jump", "jury", "just", "justice", "keep", "kick",
	"kidnap", "kill", "kind", "kiss", "knife", "know", "knowledge", "labor", "laboratory", "lack",
	"lake", "land", "language", "large", "last", "late", "laugh", "launch", "law", "lead",
	"leak", "learn", "leave", "left", "legal", "legislature", "lend", "less", "let", "letter",
	"level", "liberal", "lie", "life", "lift", "light", "lightning", "like", "limit", "line",
	"link", "liquid", "list", "listen", "literature", "little", "live", "load", "loan", "local",
	"lonely", "long", "look", "lose", "loud", "love", "low", "loyal", "luck", "machine",
	"magazine", "mail", "main", "major", "majority", "make", "male", "man", "manufacture", "many",
	"map", "march", "mark", "market", "marry", "mass", "mate", "material", "mathematics", "matter",
	"may", "mayor", "meal", "mean", "measure", "meat", "media", "medicine", "meet", "melt",
	"member", "memorial", "memory", "mental", "message", "metal", "method", "microscope", "middle", "militant",
	"military", "militia", "milk", "mind", "mine", "mineral", "minister", "minor", "minority", "minute",
	"miss", "missile", "missing", "mistake", "mix", "mob", "model", "moderate", "modern", "money",
	"month", "moon", "moral", "more", "morning", "most", "mother", "motion", "mountain", "mourn",
	"move", "movement", "movie", "much", "murder", "music", "must", "mystery", "name", "narrow",
	"nation", "native", "natural", "nature", "navy", "near", "necessary", "need", "negotiate", "neighbor",
	"neither", "neutral", "never", "new", "news", "next", "nice", "night", "no", "noise",
	"nominate", "noon", "normal", "north", "not", "note", "nothing", "now", "nowhere", "nuclear",
	"number", "obey", "object", "observe", "occupy", "ocean", "of", "off", "offensive", "offer",
	"office", "officer", "official", "often", "oil", "old", "on", "once", "only", "open",
	"operate", "opinion", "oppose", "opposite", "oppress", "or", "orbit", "order", "organize", "other",
	"our", "oust", "out", "over", "overthrow", "owe", "own", "pain", "paint", "paper",
	"parachute", "parade", "pardon", "parent", "parliament", "part", "partner", "party", "pass", "passenger",
	"passport", "past", "path", "patient", "pay", "peace", "people", "percent", "perfect", "perform",
	"period", "permanent", "permit", "person", "persuade", "physical", "physics", "picture", "piece", "pig",
	"pilot", "pipe", "place", "plan", "planet", "plant", "plastic", "play", "please", "plenty",
	"plot", "poem", "point", "poison", "police", "policy", "politics", "pollute", "poor", "popular",
	"population", "port", "position", "possess", "possible", "postpone", "pour", "poverty", "power", "praise",
	"pray", "predict", "pregnant", "present", "president", "press", "pressure", "prevent", "price", "prison",
	"private", "prize", "probably", "problem", "process", "produce", "profession", "professor", "profit", "program",
	"progress", "project", "promise", "propaganda", "property", "propose", "protect", "protest", "prove", "provide",
	"public", "publication", "publish", "pull", "pump", "punish", "purchase", "pure", "purpose", "push",
	"put", "quality", "question", "quick", "quiet", "race", "radar", "radiation", "radio", "raid",
	"railroad", "rain", "raise", "rape", "rare", "rate", "reach", "react", "read", "ready",
	"real", "realistic", "reason", "reasonable", "rebel", "receive", "recent", "recession", "recognize", "record",
	"recover", "red", "reduce", "reform", "refugee", "refuse", "register", "regret", "reject", "relations",
	"release", "religion", "remain", "remains", "remember", "remove", "repair", "repeat", "report", "represent",
	"repress", "request", "require", "rescue", "research", "resign", "resist", "resolution", "resource", "respect",
	"responsible", "rest", "restaurant", "restrain", "restrict", "result", "retire", "return", "revolt", "rice",
	"rich", "ride", "right", "riot", "rise", "risk", "river", "road", "rob", "rock",
	"rocket", "roll", "room", "root", "rope", "rough", "round", "rub", "rubber", "ruin",
	"rule", "run", "rural", "sabotage", "sacrifice", "sad", "safe", "sail", "sailor", "salt",
	"same", "sand", "satellite", "satisfy", "save", "say", "school", "science", "sea", "search",
	"season", "seat", "second", "secret", "security", "see", "seed", "seeking", "seem", "seize",
	"self", "sell", "Senate", "send", "sense", "sentence", "separate", "series", "serious", "serve",
	"service", "set", "settle", "several", "severe", "sex", "shake", "shape", "share", "sharp",
	"she", "sheep", "shell", "shelter", "shine", "ship", "shock", "shoe", "shoot", "short",
	"should", "shout", "show", "shrink", "sick", "sickness", "side", "sign", "signal", "silence",
	"silver", "similar", "simple", "since", "sing", "single", "sink", "sister", "sit", "situation",
	"size", "skeleton", "skill", "skin", "sky", "slave", "sleep", "slide", "slow", "small",
	"smash", "smell", "smoke", "smooth", "snow", "so", "social", "soft", "soil", "soldier",
	"solid", "solve", "some", "son", "soon", "sort", "sound", "south", "space", "speak",
	"special", "speech", "speed", "spend", "spill", "spirit", "split", "sport", "spread", "spring",
	"spy", "square", "stab", "stand", "star", "start", "starve", "state", "station", "statue",
	"stay", "steal", "steam", "steel", "step", "stick", "still", "stone", "stop", "store",
	"storm", "story", "stove", "straight", "strange", "street", "stretch", "strike", "strong", "structure",
	"struggle", "study", "stupid", "subject", "submarine", "substance", "substitute", "subversion", "succeed", "such",
	"sudden", "suffer", "sugar", "suggest", "suicide", "summer", "sun", "supervise", "supply", "support",
	"suppose", "suppress", "sure", "surface", "surplus", "surprise", "surrender", "surround", "survive", "suspect",
	"suspend", "swallow", "swear in", "sweet", "swim", "sympathy", "system", "take", "talk", "tall",
	"tank", "target", "taste", "tax", "tea", "teach", "team", "tear", "technical", "technology",
	"telephone", "telescope", "television", "tell", "temperature", "temporary", "tense", "term", "terrible", "territory",
	"terror", "terrorist", "test", "than", "thank", "that", "the", "theater", "them", "then",
	"theory", "there", "these", "they", "thick", "thin", "thing", "think", "third", "this",
	"threaten", "through", "throw", "tie", "time", "tired", "to", "today", "together", "tomorrow",
	"tonight", "too", "tool", "top", "torture", "total", "touch", "toward", "town", "trade",
	"tradition", "traffic", "tragic", "train", "transport", "transportation", "trap", "travel", "treason", "treasure",
	"treat", "treatment", "treaty", "tree", "trial", "tribe", "trick", "trip", "troops", "trouble",
	"truce", "truck", "true", "trust", "try", "tube", "turn", "under", "understand", "unite",
	"universe", "university", "unless", "until", "up", "urge", "urgent", "us", "use", "usual",
	"vacation", "vaccine", "valley", "value", "vegetable", "vehicle", "version", "very", "veto", "victim",
	"victory", "video", "village", "violate", "violence", "visa", "visit", "voice", "volcano", "volunteer",
	"vote", "wages", "wait", "walk", "wall", "want", "war", "warm", "warn", "wash",
	"waste", "watch", "water", "wave", "way", "we", "weak", "wealth", "weapon", "wear",
	"weather", "Web site", "week", "weigh", "welcome", "well", "west", "wet", "what", "wheat",
	"wheel", "when", "where", "whether", "which", "while", "white", "who", "whole", "why",
	"wide", "wife", "wild", "will", "willing", "win", "wind", "window", "winter", "wire",
	"wise", "wish", "with", "withdraw", "without", "witness", "woman", "wonder", "wonderful", "wood",
	"word", "work", "world", "worry", "worse", "worth", "wound", "wreck", "wreckage", "write",
	"wrong", "year", "yellow", "yes", "yesterday", "yet", "you", "young", "zero", "zoo",
    ];
    return word_list("voa", words, table);
}

//
// The callsigns worked by M6A in the 1996 CQ WW CW contest.
// This list comes from a program called pileup.

function word_list_callsigns(table) {
    var words = [
	"S51FA", "LY2FN", "EI7M", "RX3QX", "M6O", "DL9GOA", "OK1EW", "GM3PPE", "DF0HQ", "RX6AM",
	"SM3GSK", "DL7QU", "DL3XD", "SP3CB", "OH2WI", "YT0T", "DF0DF", "OH6RA", "SP2DX", "DL0KF",
	"5V7A", "9A1A", "OK1FAU", "OK1AU", "YL2VW", "UT8IM", "DK5PR", "OK1TP", "DF3CB", "SP6CTC",
	"PA0LOU", "SM6CST", "DL3BUM", "SM6CTQ", "SM6OLL", "OM2XW", "RN3F", "OH1NOR", "S51EA", "GW3JXN",
	"OK1MG", "OK1MNW", "OZ5WQ", "DL8YR", "DJ5AV", "G3VNG", "G3KDB", "SP5GH", "W9OR", "DK0ZG",
	"OM5ZM", "F6CNI", "SP5GRM", "S57O", "LA8WG", "YL2GTY", "DL5SDF", "G0IVZ", "OK1DOT", "RU3A",
	"OK1KZ", "DL2GGA", "DJ7MI", "YL2UZ", "EM2I", "DL7BQ", "YL2GP", "PA3APW", "DJ9LJ", "DK7SU",
	"DL6EN", "UU9J", "WB9Z", "PA0HIP", "TK5NN", "OK1DXW", "IK1IPV", "OK1HCG", "UA1OZ", "G0KRL",
	"DL3JAN", "F6KEQ", "DL6RAI", "UY5EG", "OY9JD", "RX1OX/FJL", "RZ6LJ", "SP9KRT", "OK1KH", "OH6KIT",
	"F5NQL", "OM3IAG", "US4IBU", "7S0MG", "UA2FT", "SP5JTF", "LZ2UG", "GM4SID", "EU5F", "LY1DQ",
	"LA9DFA", "DL8ZAJ", "RV1CC", "GU3HFN", "OI4JFN", "G3RZF", "CT1AOZ", "OK1BMW", "YL8M", "LA2O",
	"DJ9CN", "7X2RO", "OY1CT", "9A2VA", "SM7DLZ", "4X4NJ", "TK5EP", "OE1A", "SP5ALV", "G3UFY",
	"OT6T", "OZ7NB", "LY7A", "GI3FJX", "UT3UZ", "HA8QC", "SM5HJZ", "EI4DW", "CG1ZZ", "PA0CLN",
	"LY2OU", "ES1RA", "ON6ZX", "ES1QD", "UU5J", "SM3KOR", "4U1ITU", "GW4BVJ", "SV8ZC", "UN7JID",
	"HA0HW", "LZ7M", "ON6YH", "OK1ABF", "RZ4HO", "OH1AJ", "DL9MH", "G0PRY", "OM7DX", "S59AA",
	"YT7DX", "OL3A", "S53X", "NN4T", "SP5CJZ", "RU9CK", "RU9CZ", "YL2KO", "RW6XA", "UT7ND",
	"OK1AAZ", "K8MFO", "K3ZO", "S53M", "K0EJ", "DL8ZAW", "RW3FO", "K3LR", "K8MD", "W1BIH",
	"G4KIV", "4V2A", "EU4AA", "RZ1AWO", "SP9A", "W9RE", "K9DX", "KB1H", "I0ZUT", "OK2EC",
	"4N7CA", "VO2WL", "OE3S", "J6DX", "UA6CBM", "K5TF", "IU2E", "W0BV", "RK9CWY", "LY2BZ",
	"DL5JAN", "S51NP", "LX/DF0BK", "GW3SYL", "UX1HW", "K3KO", "DF0IT", "K1VR", "K4PI", "US2YW",
	"W5TCX", "S50U", "RZ4AY", "W3GG", "OK1TJ", "UA4CJJ", "OI9BVM", "UT5USX", "W4VQ", "UT5UIA",
	"4N1A", "RW6BO", "K1KI", "DL6YRM", "DL1LOD", "DL7ANR", "S51NU", "OK1DG", "VE9DH", "DL3KWR",
	"OZ8AE", "K2PS", "K1NG", "3C5A", "DK4TA", "OH1NSJ", "N3NT", "N6CQ", "K1ZZ", "DL4ZBY",
	"K2SX/1", "K3NZ", "EU2MM", "K1KP", "S57NL", "EA2FBR", "WX8B", "N6ZO/MM", "N2MM", "SP3GTS",
	"RK9CWW", "RA3AF", "UX1DZ", "W4PB", "W0LH", "OK2PCN", "K4ZO", "RZ6LG", "OI2GB", "DF4ZL",
	"RA3CW", "N4CW", "HA1SD", "W4RJC", "EA2BNU", "LY2BTS", "S53EA", "UX5UO", "SL0CB", "K2SHZ",
	"EA1DD", "LZ1PM", "RZ3FW", "SP4GFG", "DJ8CR", "W9OA", "RK4WWA", "K3II", "UY4E", "F5OJL",
	"OM8A", "WA1LNP", "N4XR", "RZ3Q", "UT4EK", "DL1TH", "DJ9RR", "OH2BSQ", "IK5TSS", "NE3H",
	"HA2EOA", "ES1TM", "W1PL", "K3ANS", "K9MA", "RK3YWA", "OH2AQ", "LA8SDA", "VO1GO", "HG5M",
	"OT6P", "RW3WM", "YL3FW", "4X7A", "N3EN", "DK8TU", "9A3QK", "LY2TX", "UY0MM", "RV3FF",
	"RA4PM", "YU7CB", "HA4FV", "N9BP", "OK2BEE", "K8LX", "WA2VYA", "F5RAB", "DF1DV", "SP9DWT",
	"N2BA", "EA8CN", "S53CAB", "N2LT", "LY3CW", "SP6BAA", "IG9/AC6WE", "SP3LPR", "SP6NIC", "RN4W",
	"OH1SH", "IK4EWX", "N4AF", "WU3A", "OM3YCA", "YT0U", "W2UP", "OH2NQS", "RW6AW", "SN8V",
	"LZ1BJ", "RV6ASY", "W3GN", "N4ZJ", "RZ3DZ", "KV1W", "UT1YW", "HA3LI", "W4XJ", "DJ2XC",
	"UX3ZW", "K2DM", "RA1TU", "SP4EEZ", "8R1K", "W2RQ", "UA2FP", "OM3ZIR", "DL8OBC", "W5WQN",
	"OH1TN", "F6CAV", "OM3EA", "OZ8NJ", "K8DO", "VE3CRG", "UA1ACG", "OK2EQ", "YZ7A", "UR5ZOS",
	"UA1ANA", "K3JGJ", "N4YDU", "K5KG", "RK4B", "DL8WEM", "KW2J", "OK1AJY", "UR5LF", "WA0FAX",
	"UY5TE", "DK8GB", "K5YA", "K0QC", "OK2PJW", "HAM8LKC", "W2PP", "UT1PO", "UA9KAA", "W4OB",
	"S57U", "9A11TM", "RA6AF", "K8UNP", "N1TT", "W1WFZ", "HA5NK", "S54MM", "RX6AY", "9A3GU",
	"UT3WW", "CT8T", "LZ5W", "W4RX", "OM5NA", "SP7JQQ", "I3JTE", "YU7BW", "OK2PBG", "YT0E",
	"UA6AF", "OM3EK", "SV1AFA", "4N7A", "W4PRZ", "K4NA", "HA5KFU", "IS0MKU", "HB0G", "SQ9BZ",
	"N4CM", "YU1JU", "S57AL", "HA6IAM", "UX5QT", "LZ2KMS", "EA8EA", "KN4T", "W5WA", "IK0YVV",
	"HA8VK", "OK2VWB", "F6IIE", "UR4PWC", "UX6VA", "UX3M", "HA1KRR", "OM1AF", "SP6OJE", "G6D",
	"UX7QQ", "S59D", "UA6JY", "OM3PQ", "S52OT", "YU7KM", "OH1EH", "SP5EVW", "HA1KW", "W3LPL",
	"K2BU", "F6CWA", "DL9JI", "UR5UW", "OE3JOS", "OK1GM", "LY3MR", "N8BR", "LY5A", "HA5WA",
	"GW4HBK", "K8CC", "W3EA", "K4II", "KL7RA", "KP3G", "K4SXT", "NJ4F", "WT1H", "J39A",
	"N6AR", "W3GU", "UU0JM", "WA5QHX", "DK1RV", "TI4SU/5", "F6DZB", "W9RN", "DF7IS", "OK1HDU",
	"KB2VVU", "DL1MEV", "DL1HQE", "DF9ZP", "DL4BQE/P", "K0KX", "DL7AOJ", "N4TY", "K2ONP", "LY5W",
	"OK2PO", "RZ1AZ", "N4VV", "UA1AFG", "RV1AQ", "N3RW", "YU1L", "G5MY", "F5ROX", "VE1JU",
	"YO6KBM", "DL3SZ", "HA4FF", "DL1JF", "HA8IB", "IK2VJF", "N2TX", "OK1MNV", "K4LTA", "AA5BT",
	"SP2LNW", "9A2WJ", "UA2FJ", "DL1LQA", "WB2JZK", "YU1FJK", "DJ5GW", "K3KY", "NB6V", "UR5XA",
	"YU7SF", "W4BQF", "G5LP", "OK2HIJ", "W2FR", "PA0MIR", "HB9CZF", "DL5YCI", "SV1SV", "UA0OMS",
	"SP9XCN", "S51M", "ZD8DEZ", "OM3GB", "OM5RJ", "KM9D/C6A", "OK1BB", "LY2KM", "OH2LP", "DL1SP",
	"K2LE", "K4RO", "SP3FLR", "OM6AUU", "OK1XUA", "HB9KOG", "RZ9AZA", "F5NBA", "W3BGN", "F5CLP",
	"OM3TLO", "OK1CW", "EK4JJ", "OZ5UR", "RP3LKN", "DF3QG", "HA7JTR", "YT1BB", "DL1NF", "N4TO",
	"TU4FF", "S58MU", "W9LT", "N2NT", "K8AZ", "YL2GQT", "F5PRH", "SK6KKK", "F6BUM", "KD2RD",
	"OK1KAI", "YO3FRI", "V47VJ", "UN9LY", "SM7VBX", "OK1CZ", "S58WW", "K5RT", "G3EZZ", "DL2KAS",
	"J45T", "HA0DBG", "EA4AMJ", "EA2CRB", "ED9EA", "UT5UJO", "CT3FN", "UX1UA", "9A2AA", "YO4BBH",
	"LK7A", "RU3DU", "RK3DH", "YL2KA", "HA5FW", "RA4HT", "JA9NFO", "YL2CV", "RK3AWL", "HA3FZ",
	"EW1EA", "LY2MV", "LY2NV", "3B8CF", "Y21LY", "YT7P", "LZ1TT", "YU1RE", "IK6SBE", "EW8DX",
	"YT0X", "OK2BCZ", "YO7CKQ", "HA3LQ", "A61AJ", "SM0CCE", "OK2BU", "SN9C", "LY2FE", "OK2ON",
	"OK2BBQ", "EW2DD", "I7PXV", "S57DX", "OEM3HM", "RV6YZ", "A45ZN", "IK3TXQ", "S59AV", "OK2TBC",
	"OI7T", "RA3GDB", "HA8TI", "UT2QT", "YU7DX", "A71CW", "S51KV", "LZ1IQ", "LZ3Q", "S52LW",
	"EX9A", "LY3DY", "9A2TN", "I0MWI", "4N1N", "LZ1QZ", "S57AX", "TU2MA", "HA9PB", "S56A",
	"UN7TX", "Z32KJV", "IK5ACO", "EA7TH", "LZ7N", "4N7EC", "OM4TC", "YU1KX", "S31SV", "J45DZX",
	"G3PJT", "DL5ZN", "OM6TX", "LY2BN", "LY3BG", "YL2ON", "UT3QW", "PA0JED", "TA3D", "OM3TBO",
	"RA4PQC", "SP9YDX", "PY1DYM", "Z32XA", "YU1QW", "HA1CW", "EA3ANH", "9A5I", "HA5AEX", "OM8RA",
	"9A2NO", "YB1AQS", "9A5WW", "UR4LCB", "IT9VDQ", "SP4AVG", "9A1HBC", "RA3RN", "HA5BUB", "YU1TR",
	"IS0LYN", "IS0XPK", "GM6Z", "PY5BLG", "RA3XR", "OK2BNC", "EA9UG", "UT7EG", "UR4LZA", "RW2F",
	"SP8GD", "OM3RJB", "S58AL", "YT1MP", "UX5EF", "YU1KN", "UR5QLN", "IK0WMT", "HA0GK", "9A3MN",
	"JA1YXP", "S59AR", "ZL1AMO", "OM9TR", "EA7MT", "OZ5DX", "YU7WJ", "YT1DZ", "OK1BA", "OE1CLW",
	"RN3QO", "LZ2MP", "OL7Z", "UX5VK", "US7RA", "UA0AGI", "I5ZUF", "T93R", "HA8PX", "SP3MGP",
	"S51EP", "SV1DOJ", "4X/OK1JR", "SL3ZV", "SM3OSM", "OEM1GOA", "LZ7R", "ZX1A", "EA7GP", "LU7FJ",
	"IS0OMH", "ZL1WX", "9H0A", "ZJ1TU", "SP5AHZ", "IK0TXF", "RA2FBC", "DK4RM", "7Z5OO", "OK2PCL",
	"S51TE", "RZ9AXA", "OK1FZM", "IK8TPJ", "DL1HWB", "EA3CA", "OK2BVM", "US0IZ", "SP2PIK", "IV3TMM",
	"OK1XC", "9A1AA", "OK1AOV", "PP1RR", "4X6PO", "OK2PVG", "PY0FF", "OK1FHD", "YO4DCF", "DJ4CF",
	"HA7XL", "UY7P", "OK1AVY", "LY1DM", "OM8ON", "KH0DQ", "EA7AAP/QRP", "OK2PLK", "OE7Z", "UA6JAD",
	"DL1DQ", "DL2GBB", "US4IDY", "S58A", "UR7R", "YT1AD", "UT0IU", "UR5YG", "OM2SS", "UR5MTA",
	"UR5LM", "7S0AG", "TA2DS", "RA3SL", "YO8FR", "HA5NG", "UA4LMV", "OK2WCN", "LZ1AG", "G3KYF",
	"OK1SI", "UY5QQ", "OE6RAG", "TA2IJ", "Z32KV", "Z37FCA", "LA9AU", "LZ2TW", "IK0TUG", "LZ6A",
	"4X6POB", "UY5OQ", "UY5DX", "IT9GGW", "IV3BEI", "UT7LA", "IV3IUM", "P40W", "EM7Q", "YZ1WG",
	"9A2HF", "FS5PL", "S57J", "UT5UN", "UX0LP", "UR5IPD", "OM3A", "DL2GB", "IV3JWY", "UA3RO",
	"9A5EI", "RN3R", "YO7YO", "YO3APJ", "OM7YX", "YT1UDH", "YB2UDH", "IK2QPR", "RZ6HX", "RV6LFE",
	"IK5ALI", "SP9HWN", "OH0MAM", "LZ2JA", "IV3TYE", "UA4CW", "RW6ACF", "9Y4VU", "UT7GTU", "IK4ZHH",
	"RZ7LJ", "RW6AWT", "HA5OG", "RA1QHJ", "HA2MJ", "IQ4A", "UA3TAM", "Z37FRP", "ES2RJ", "OE5WLL",
	"N2JT", "K3IE", "W4WA", "K1TTT", "UN8LF", "UI0IEZ", "9A3UF", "UA9CAX", "OE3DSA", "K2LM",
	"W8BD", "HA3HP", "K4VX", "N8UO", "UR4QIN", "RX3RB", "UX7QD", "SP7NMW", "SP6CXH", "I0KHY",
	"IK2AHB", "N3FF", "OK1MKU", "SP5NZL", "OK1FPG", "EA8ASJ", "OK1AYY", "CT1ETT", "IK2MRZ", "OM6VV",
	"UA9IH", "II2K", "NF8R", "RU4WE", "OI2RL", "SP5EKZ", "K8UR", "W2TZ", "PY2IQ", "W2WSS",
	"N4IR", "N3TM", "KA1TU", "N3LM", "UA6LAK", "IK2ILH", "WT1O", "K1RC", "VE1JBC", "WT3W",
	"N2AU", "DL2YD", "G4IFB", "WD2YQH", "DJ8FR", "K3ZA", "WS1E", "W9AU", "WF3J", "K2LP",
	"OK2HAT", "UN5G", "K2NV", "KA3VVM", "ZX2X", "OZ1HB", "F3TH", "W4IA", "W4TO", "W9LNQ",
	"WG3U", "EU1FC", "NY3C", "KC1DI", "N2RM", "N1RJF", "K4SI", "N3TCH", "NF2K", "DK5EZ",
	"TA2BK", "N2TCH", "AI2C", "K4MF", "3G1X", "VP2ETB", "ZF2RF", "9Y4H", "KC1XX", "K1AR",
	"W8KTQ", "W5FR", "CG1HA", "NI4M", "K3TEJ/C6A", "TI1C", "N1SNB", "K5IID", "WP2Z", "EI8NP",
	"DL0LR", "KD1YN", "K3PLV", "WD4AHZ", "WA8DXB", "K2MN", "VE3MFP", "VE3RT", "D44BC", "K1RV",
	"W3FG", "WB9AYW", "K3SWZ", "K5KDG", "VE3ST", "KE2WY", "W4CK", "N3RR", "K2WU", "N4MM",
	"N8ZMF", "K2WS", "N3II", "KJ5TF", "K9ALP", "W2XI", "NA2U", "W1GD", "W4EF", "DJ2YA",
	"CP6AA", "CX6FM", "3E1DX", "NG8D", "W3MM", "W3EEE", "G3HQH", "W3AU", "WB4TDH", "GM0MOW",
	"K2SWZ", "K8MR", "N8JF", "VE2AYU", "UN7CW", "K8GM", "W2EZB", "WA2C", "W1CNU", "AA2UT",
	"HA8EK", "N0XFC", "JA5GJS", "W3EVW", "W1TE", "K1DD", "KX7J", "VA3KA", "K5ZD", "K2SQ",
	"K2JLA", "GW3JSV", "W3HVN", "SP7ELQ", "W3TWI", "W2YC", "VA2AM", "W8ZT", "KT1H", "CJ3TEE",
	"W3TVB", "W1AX", "N8BJQ", "W4PNK", "AA3PD", "KA1A", "W1NR", "W2HLI", "W8CNL", "NM1Q",
	"K1HI", "W3GK", "N1AFC", "W2NCG", "K2PK", "W8UPH", "K8ZBY", "N6RFM", "VE3WZ", "OX3LK",
	"K8UCL", "N4NO", "KA2GSL", "K3ONW", "W0UO", "KF2O", "W0PA", "ND9O", "KF8TM", "K9CAN",
	"K8BCK", "AE8T", "K0RF", "AD1B", "VE3OTL", "KQ2M", "KT1E", "K4GN", "W3EPR", "W2VVS",
	"K8UPR", "PY2HQ", "W3SOH", "W4GBF", "W4VP", "KB5WT", "WF3M", "K8JK", "K2GS", "N4BP",
	"K9MMS", "K5VR", "W9OO", "KJ9C", "W2AOY", "WA3YKI", "N2LBR", "W8TPS", "KV8S", "WA4ZJJ",
	"KA1O", "VA3GW", "AA2U", "NO1V", "W2HUG", "VP5EA", "W4PA", "OK1NG", "NT8S", "NW7E",
	"OL2A", "AA6G", "NZ1Q", "K4FW/8", "KD6WW", "DL3JFN", "OK1JL", "KA2DIV", "KN3P", "K4GEL",
	"WT8P", "SP6CPF", "W6DU", "K6DT", "KG0DS", "K3ND", "SP5XMM", "PA0ABM", "WA9LEY", "KC0EI",
	"K2ZA", "VE5SF", "N3UMA", "AD4ZE", "KP3S", "SP3BNC", "W2II", "K4TWJ", "N4XO", "W9OP",
	"W5FO", "N5ZX", "N0KM", "DL2DSD", "W3NO", "PY2NQ", "X51AV", "XO7A", "VE2FF", "K2MFY",
	"W8UD", "W1RH", "F5AIB", "WD5K", "9A1EZA", "OE1NYO", "W0TM", "W3DKT", "N9GG", "WA2VQV",
	"OK2PTU", "W4PRO", "N3KR", "DL5ZB", "SP9RVP", "PZ1DV", "SP9HXA", "ZL3CW", "LU4HH", "K3KK",
	"WG8Y", "WT3P", "SP9PEX", "YO4GDP", "OK1ACF", "PI4CC", "N2FF", "YU7AV", "NP4Z", "K3ZZ",
	"K5MA", "SP9SOI", "K1SM", "K1OZ", "W9OF", "AA3D", "DL5JRA", "WN9O", "AA5GY", "HA5DQ/7",
	"N1AC", "9K2/YO9HP", "YO5CUU", "K1EFI", "KV4P", "KE4JLN", "AD8J", "F5AIL", "K1TI", "WB2ZZG",
	"K3AN", "NK3U", "OK1FBV", "8P9Z", "US2WV", "US9KW", "EA3AJR", "UR5WX", "IK6SNQ", "F6GCP",
	"OL4M", "IK0TUM", "K1DOX", "UY4WWA", "UT3UY", "EA4ML", "OM3WM", "UA3UA", "OK1KSD", "HA3GE",
	"DF0HTE", "OH0JJS", "K1AM", "OK2DA/P", "OK1FAE", "WA4D", "9A3KQ", "UT4NW", "UT7W", "HA6NA",
	"UE1ZJ", "ER5GB", "DL8NBJ", "I5RFD", "W8JGU", "UT2UB", "K0WMT", "S54A", "OM1AW", "S52SK",
	"9A4D", "W2BA", "F6VK", "RW9USA", "HA1TX", "K8DC", "DK5PD", "OM3BT", "IG9/I2VXJ", "IV3FEW",
	"OM3TU", "EA1PO", "UY5QO", "S53EO", "HAM5BPC", "OZ5ABD", "LY1FM", "YU1WR", "OK1XNF", "SP3CNP",
	"DL1DTC", "DL1AKZ", "OH0MMF", "DK1BA", "SP4BOS", "HA8PG", "S51UJ", "DL2BWG", "GM3YOR", "HG6V",
	"OH1XT", "SM3AHM", "RA3PP", "OK1KUO", "IK4MED", "RA3DN", "IN6DCH", "DL0QW", "DL3JMK", "RW3QT",
	"RW4FZ", "I4FTU", "RA4HUQ", "YU1BL", "DL7VMM", "UA1AFT", "SP2FGO", "DJ6DO", "EI4MM", "OZ7BW",
	"LZ1ZF", "DL0KFM", "DL6CGT", "S57NGR", "HB9HQX", "SP2MHC", "DL3KVR", "EA6IB", "CT3/DL5YM", "DL3DBY",
	"ON4XG", "PA0SNG", "UA6LQ", "OI3MF", "OZ4OC", "OE6HZG", "OK2BND", "DL6AG", "G4OIG", "OK1FCA",
	"OH6FW", "DL4FDM", "F5MOY", "UA1QV", "DL6MHW", "DL8KUB", "OM5KP", "VP2EEB", "JH4CPC", "SM7BHM",
	"DL1AOQ", "DA2OL", "UY5ZZ", "JS3VNC", "US6UN", "UX2VA", "OZ1HG", "F6GR", "OK1FHI", "EW5P",
	"VK6LW", "OI5N", "S57X", "DK0EFA", "LA8LA", "YU1AO", "OK1DKR", "SM0CSX", "XX9X", "OK1KF",
	"UA3MM", "Z37EF", "PA0RCT", "M6B", "CE3F", "RV6HA", "HB9BGI", "DL2JX", "RA1QN", "DL9XY",
	"RW1A", "OH7RJ", "DK5MV", "JH7RNJ", "I1HJT", "RZ4AYT", "DL1ZQ", "OH5LAQ", "DL4UF", "I2VRF",
	"RK6AM", "DK4QT", "DL6UNF", "DL8SCO", "JJ1DLT", "DL9CUG", "F5RBG", "9A3NU", "W1MK", "JA5QJD",
	"T99W", "JH1TG", "UX3IW", "JA0RUG", "HB9BAT", "G3DLH", "IK1RQQ", "OH4YR", "US4EX", "RZ1AWD",
	"YL3AD", "OK1FKV", "JH1ROW", "G3LIK", "9A3SM", "OH3MEO", "K3UA", "UT1WZ", "LZ1VA", "G3RKJ",
	"OK2QX", "DL7VAF", "DK8FS", "SM0BDS", "G3GLL", "YT7TY", "F5MPS", "OK1FHL", "SP2QOD", "EC5CFQ",
	"F6CRP", "OK1MPM", "T9DX", "DL3XG", "DL0AF", "EA8PP", "YW1A", "3V8BB", "HA8CQ", "OM8AA",
	"W0AIH", "9A2JK", "IK8TPE", "HA2MV", "UR4UF", "Z31AA", "OK2PHC", "HA3PT", "DL8WN", "IT9AJP",
	"ON7CC", "HAM6VA", "OI3KCB", "SM5AOE", "UX4UA", "F6HNX", "EA5KB", "RZ3DY", "EA1FBJ", "W1WEF",
	"DL5ARM", "PA3CBA", "ON6CW", "RK6AYN", "F6CNN", "UR2CZ", "S53W", "DL1HSL", "RZ1AWT", "F5AKL",
	"F5JGB", "G3CCO", "OE3AKA", "SP8NCS", "K8SSA", "CT1DRB", "DL4FMA", "UA9OC", "T94YT", "OK1HX",
	"G3SSO", "SP3NX", "RA4FW", "OZ5RM", "W1EVT", "RA3XD", "DJ1TO", "DK7ZH", "DJ7AA", "HA8PO",
	"IQ7A", "W1DEO", "EA5FV", "EA7BJ", "UA9KW", "OK2DU", "LU1IU", "RV3GW", "UX3MF", "DL1NEO",
	"HA8BE", "HB9DCA", "V26LN", "HB9CAT", "RQ4L", "RA3XO", "DL8YTM", "SM6NM", "DJ7AO", "S54E",
	"DL2AMD", "DF1DB", "G8PW", "PA3AFF", "DA8IE", "G3USE", "G4BJM", "OK1KIR", "OK1PG", "SP3JGV",
	"SP9MOV", "DL1HRY", "OI2OT", "DL5AWI", "II1R", "RK9CX", "X5AU", "RW3AH", "YU7NU", "LA9VDA",
	"WU1ITU", "DF7CB", "W1NG", "F9OQ", "RU6LAZ", "9A4RU", "K4ABX", "SP2UKB", "DA0KD", "RW6BJ",
	"IK8SMZ", "N3OC", "LY2BM", "N8TR", "W9YSX", "UR4UGT", "N2LDR", "DA0RP", "KS9K", "K2SG",
	"DL9GFB", "NW3H", "ZS6P", "W8PC", "DL5AJO", "PA3GNO", "DA0ES", "OK2PUG", "OM3TA", "AA1ON",
	"K4OF", "YT1I", "N4AR", "F4JYC", "OH7NVU", "N1TE", "EA3GHB", "K4DTT", "W1EQ", "K2UFT",
	"AA1V", "YO4WP", "EC3AAF", "W1KM", "RK3SWX", "OK1DT", "KT3Y", "W9CS", "IK4GNM", "ES0NW/QRP",
	"RA1QFY", "WY4E", "5X4F", "GI4SNC", "W2KA", "F6EIM", "W1QK", "RA9AE", "S53AK", "W4WW",
	"N2WK", "N3UN", "UX9ZX", "K4DY", "RA9LT", "RU4CO", "EW1MN", "K2MP", "OK2RZ", "K1TR",
	"OK1VD", "OK2ABU", "W1OO", "LY2GV", "HI3JH", "G3JKY", "N4RV", "K4AAA", "SP1FJZ", "W1MR",
	"UA9XS", "N3OS", "N4XM", "EA4AAF", "K1MO", "W0GL", "SM4BNZ", "OK1MKI", "LA9GX", "SM5IMO",
	"VE3RM", "DL1CC", "S57MRG", "W4YE", "I4ZMH", "OK4QKD", "HG1G", "LA2UA", "OK1TXB", "EA8AK",
	"LA2KD", "K9UWA", "WD8AK", "OM7RU", "S51DQ", "UT5EH", "LY3AV", "SP5ES", "9A4RC", "N2RD",
	"EA5KK", "W3UJ", "EA7HDO", "UP2GUC", "DL4MT", "N1JAC", "DL7USW/P", "DF3OL", "Z31JA", "UT0MF",
	"DL6MTA", "OK1DNR", "HB9AFH", "OH2BJG", "RA6AAD", "HA7CY", "UY1HY", "UA4CDG", "DL2TG", "UY2IZ",
	"EA3DA", "K2QAR", "HB9CDG", "N4CC", "W3RJ", "OK2KR", "W1EYT", "F6FII", "DL2ZN", "Y21RM/QRP",
	"UY5AB", "K3OO", "OK2WM", "HA3FTA", "HB9Y", "HG9Y", "F6YAR", "DK3ARX", "DL3AR", "DL7RV",
	"HB9ZE", "LA6MP", "OK2PMN", "N4TZ", "F5POJ", "HA8KW", "ER3DX", "UA3DGA/QRP", "K5GN", "K3YD",
	"K4XG", "DL2HQ", "UR7QM", "OK1PFM", "UP5ELA", "DL1AMQ", "W6XR", "SM0DSF", "J87GU", "YL3IG",
	"S51NY", "UT4QT", "HA8DD", "K2SWP", "K2SS", "K2GZ", "UA3AGW", "SP2QCH", "DJ6QT", "SM0DJZ",
	"UY0CA", "RW3VU", "N0NI", "DF2PI", "UX4UM", "OK1FV", "G0NOA", "LY2FE/QRP", "DL3BQD", "OM5DW",
	"I2FUG", "DL3MGK", "9A5A", "OK1DJK", "SP2AOB", "S59A", "DJ3RA", "KP2A", "DJ2ZS", "IK1GPG",
	"OI1SJ", "OK1TC", "OK2KOD", "PA3BUD", "DL3HXX", "DL1UU", "IK4BRY", "DL9NDV", "TM2Y", "F5LQ",
	"F6KAR", "PI4COM", "UR6QA", "LU1IV", "EW8WA", "HA9BVK", "CN7BK", "EN2H", "EM1KA", "IQ4T",
	"ZM2K", "IK0VXG", "RX3AMG", "OK2BJT", "HC8N", "K9NW", "EA7HAT", "I3BBK", "HA1RB", "HA1DKS",
	"OEM1KYW", "HA0IT", "HA6NL", "DL0ER", "OH1KAG", "TF50IRA", "OH8BQT", "DK5IM", "OI6YF", "RA4HVQ",
	"UA4UU", "RK3MWU", "HG5A", "HA6NF", "SP8HXN", "UT4UH", "HA2SX", "LZ2ZA", "9X4WW", "S51DF",
	"YU7BJ", "YL2TW", "YU1ZD", "HA3OU", "IK6MNB", "SP5FLB", "UX1KR", "OK2AJ", "JA3DEO", "RW3BW",
	"ON4AUC", "UT7L", "DL0VM", "UK7F", "VU2MTT", "US1E", "HS0AC", "UR4E", "YB0ASI", "HK6KKK",
	"RA6LW", "ES5Q", "RN6BZ", "UA3IAK", "RK3FM", "HB9DX", "RW6MW", "RA3DJA", "LY2BKT", "IK1ZOD",
	"UA9AOL", "SP9JCN", "3Z6RF", "ZC4EE", "YT7A", "OK1PR", "ZB2EO", "YZ1AA", "OK1FPS", "IK4HLQ",
	"HG6Y", "DL7UWL", "OH2BN", "RU6LWZ", "SM4TU", "S57XX", "PY2WA", "S50O", "CN8BK", "ER0F",
	"GI0SAP", "CT9U", "PY2TI", "ON6KW", "JO1YAO", "EA2CLU", "UX2IJ", "LA8PF", "UY5WA", "UA0SAU",
	"RA0SS", "EA5DNO", "S51EC", "YU1GC", "HL1CG", "ES7FU", "HB9AMZ", "I0WBT", "OI6NEV", "UX5TT",
	"9A4DU", "IV3DRP", "UK8AAZ", "S51WP", "UA1PAC", "DF4SA", "LY3KB", "F5IJP", "I5LHY", "HA7MB",
	"US4LWM", "RU0SU", "UA0KL/6", "RW3BK", "UA2CZ", "HA5FA", "JH6V", "S57T", "OK2XTE", "OH8NLC",
	"GW3VVU", "UA3TAH", "YU1YE", "RV3ZD", "YU1LM/QRP", "RA3VA", "RU9CI", "I2OGV", "LY2BWJ", "IK3TXK",
	"8S0FRO", "T94VA", "PA3CNK", "SP2AP", "UN7FW", "RW3VM", "RA2FZ", "RA4UU", "OH1BJJ", "UA3LIZ/QRP",
	"EA2CR", "G3IGU", "9A3ZO", "S41AFA", "RX3DTN", "EA3ADS", "UR4GH", "9U5DX", "HA7QI", "DF7TU",
	"HAM4FB", "OH5LP/4", "SM5BUH", "JH5ZJ", "UK4K", "RA6LAE", "RW4FX", "YB5YZ", "I3TXQ", "LY2OX",
	"RA3BN", "UA1AC", "RA3VY", "EW2CR", "UA9OA", "UA2WV", "SP6SYF", "PY2SP", "OH6MM", "RN9XA",
	"RX9JC", "SP5ELA", "YU7LA", "UR5MBB", "IS0URA", "OH1MYA", "SQ6EPL", "UA1OMZ", "YB5QZ", "UT5UML",
	"UA1AIR", "HA7YS", "IV4CK", "RK3AY", "VK2AYD", "VU2PAI", "UX8ZA", "I8BIO", "RW9OWD", "HZ1HZ",
	"SP2GUV", "UA4YJ", "OH8LC", "EW4AM", "WB2P", "HA3JB", "YO8DQ", "I2BAD", "YO6BA", "UY2MQ",
	"IK0XGI", "YL2MR", "SP5ICS", "F6BQY", "EA3BOW", "S41JA", "ER2WDK", "DJ9MH", "OI1HS", "LY3BA",
	"RA9DG", "RA9XF", "GM3DZB", "EA1AK/7", "HB9HQW", "JA3YFG", "UN8FB", "SM3USM", "OH2MO", "RZ3TZL",
	"RZ9SIP", "LZ1FJ", "UA9EJ", "SM0TGG", "SK6FM", "RX9CAO", "SP2FWC/P", "SP2JGK", "NO2T", "NA3AQ",
	"F6DDR", "OM6TC", "RA9JW", "YO4GHW", "AA4S", "N3AF", "OM3RRC", "VK3AMK", "RX4CT", "GM3CFS",
	"UA4ZA", "W0VU", "VE2ETY", "CT3FT", "NA2Q", "N3OSY", "W1UU", "W4IS", "N2ED", "K1NO",
	"ZP6VT", "WA2YSJ", "VE3XN", "EC8AUZ", "UA9SGN", "K4UK", "K9QVB", "UT3LL", "I6NOA", "UA1ADQ",
	"WA8CLT", "KE3C", "N4PN", "DJ4TPT", "N1DIQ", "SP9RTI", "EA8AMW", "W4AFS", "KT2E", "UX8IX",
	"WA2VRF", "K5YAA", "IK0DWJ", "W3CP", "RA4JUF", "W4JHO", "S51TB", "N4ONI", "K5SBU", "K4ZI",
	"K8SWE", "AC4PQ", "WB3AAL", "AA1HB", "W4/G4BKI", "KB3TS", "KL7HIL", "EW3EO", "K2TR", "KC3M",
	"UR2SOU", "W4ZYT", "K9UQN", "W9IL", "S59PA", "K2DYB", "K4RZ", "KS1L", "UA3DEV", "PY8JA",
	"K8GT", "RA4PI", "N3AM", "DK6OR", "K4QD", "AC4Q", "WB9SRO", "N3TG", "KC4PN", "PR7FB",
	"W5HJ", "AA8OY", "S51CA", "KC8EG", "W8AV", "DK4SY", "K2PH", "SM4TRE", "RK4HWZ", "N2FX",
	"ZW2A", "RA1ZF", "W9NTU", "F5PLC", "PI4TUE", "KM1X", "DL7MAS", "N1ET", "WB2RRJ", "OH1BZ",
	"W9XT", "W8FDV", "KS9U", "W3AG", "OK3KOD", "JY8B", "WB4UBD", "KS9Z", "NE1V", "K1AE",
	"W1RR", "RZ3BW", "CI2AWR", "K2JL", "K2TE", "W1QJR", "RK3DM", "W4BXI", "KT4GU", "W9MHE",
	"SV1CAL", "W9GIL", "F5OEV", "K9RN", "K0HT", "KD9NMU", "W5ZO", "WA4BPL", "U5MZ", "N1DCM",
	"N2CTL", "W2FXA", "KA2CCU", "WD3AAL", "LU5UE", "WA1YLP", "W4WN", "WA3SLN", "W3KV", "KC2X",
	"KA1CLV", "N4KW", "AJ3K", "N1RCT", "PY3CJI", "DL1AV", "PY1KN", "N3LFC", "W8KJP", "G0CFQ",
	"KA5W", "NN3Q", "W5KN", "NG9J", "N5DX", "NE3F", "WA4IKZ", "N3MKZ", "K3CP", "W2YE",
	"LU9EDY", "K1VSJ", "WM9X", "KA2HTU", "KB2NU", "NG3O", "N4UU", "WA4JUK", "N1CC", "N8AA",
	"NR0X", "KK4QD", "W3HR", "K4WA", "W3VT", "N2OO", "AA3JU", "W1RFW", "AA4EL", "KL7HIR",
	"PI4GLD", "N2JJ", "KD4FAZ", "W3AP", "N1SOH", "YV5JDP", "K8CW", "AB2E", "N8ET", "K3DI",
	"W3AZ", "W3TA", "N2CQ", "WA2DKJ", "LU3WEU", "WA1R", "K4FPF", "W8QKQ", "WB2KDD", "KS7T",
	"KK4UP", "K2WM", "K2LU", "WA8YRS", "W1EM", "K8CV", "EI9UK", "AC5HF", "KA1CZF", "K7NW",
	"K9PPW", "K2AW", "YU2ZZ", "W4MYA", "F6DKV", "K8HO", "PY4DHG", "K6YK", "W9KN/7", "W6NL",
	"W0ML", "EA5AGW", "WR3L", "K6JG", "G0ATR", "K6UT", "K0HB", "KC9TV", "VE3JC", "AA9AT",
	"W2HCA", "N3KRN", "W4NF", "N3FZ", "K2FU", "K6ATV", "KJ9O", "K7LJ", "9Y4KB", "6W1AE",
	"WB2ZMK", "N6AO", "W4YDD", "VO1SA", "K2DB", "WD3PM", "W7OO", "K1TH", "OK1BXE", "W1NMB",
	"EA9IU", "EA1AB", "W1CX", "K9JD", "K7ADV", "NJ2L", "K2VV", "W4OX", "W7NF", "G4LRO",
	"W6OAT", "WB6BD", "NR1F", "WA8SAE", "WD6Z", "WX8T", "K2TW", "W8TA", "W2QIP", "NF4Y",
	"ND5S", "PY2SQ", "K8EJ", "VA2EE", "AE2N", "EA1GT", "K4RDU", "LU1DZ", "NG2V", "K2OPJ",
	"LU3FSP", "WA2HZO", "ZW2Z", "AA8E", "W7NN", "WB6A", "K7FR", "K2UUT", "W5UDA", "WA8WV",
	"LW5EWQ", "W7RG", "N3AD", "9A4DA", "HA8LKB", "RA6AR", "YU7FY", "SM4CFL", "9A1EMA", "OH4OC",
	"A1TT", "HA0EQ", "SM6DER", "6Y6A", "EC5FCQ", "IS4AA", "HA8DM", "HA8FW", "UA1QBE", "YL2GN",
	"UR7TA", "HB9GCD", "OH2BNH", "HG9G", "ZZ2E", "RU4SP", "9A2XJ", "YO3BWK", "RZ3BYN", "RU6AR",
	"OI3JF", "LA9SKI", "YO3AWJ", "OK2SI", "RW1ZZ", "OI6MI", "SV2BBJ", "VK3APN", "DF3IAL", "YT1ADY",
	"DJ3XG", "OM8AU", "IK8UDV", "IK6OIN", "RA6FV", "SP5HPA", "DL9GCG", "KB2JOI", "K4AMC", "W2HDW",
	"W9CC", "W4LM", "KM2L", "K7ZI", "N8WXQ", "W4IF", "LW2DFM", "LH0I", "KO9Y", "W4RC",
	"N3KCJ", "GD4UOL", "W2AXZ", "LW2ESE", "WA4FTM", "K5SI", "PY2BW", "VE1GZV", "WA5SOG", "VE1AI",
	"N8YYS", "W8ILC", "W3QIR", "VE1NB", "NF9V", "NI5S", "LU7EAR", "AF5Z", "K0SW", "W8RSW",
	"LU2YA", "WI6E/1", "AA2FB", "UX5DW", "S50A", "UX1BZ", "NF8L", "HA8TP", "NF1R", "HA5DQ",
	"S53BB", "N4HF", "DL8HCO", "YO2BBX", "SP7GIQ", "YO4DKF", "OK1YM", "DF3SD", "SP5CCC", "N0GG",
	"W3RPL", "DJ4PT", "HAM0NAP", "RU6FZ", "W8WW", "NL1AKZ", "HA9HH", "DL3DRN", "S58DX", "UR3IOB",
	"DF6NV", "DL9SX", "DK5OS", "YU7CF", "IK3SUG", "I5VVA", "RU3QE", "LZ1KNP", "DK4WD", "SP1AEN",
	"9A4AA", "RW4WY", "SL3GV", "UT5US", "SP6CYX", "DL3DQL", "LA9MB", "OH1BV", "DL1HQV", "DL3GGT",
	"DF2HL", "LA1K", "RZ3AM", "SK5AA", "SP4GHL", "4Z9A", "XZ1N", "W8PX", "DL7UKA", "PA3ECJ",
	"DJ5OW", "RV6AF", "WW3S", "WI1E", "T94GB", "HA1AG", "RX3AP", "DL1VTL", "UA4SMM", "DK3GI",
	"W0HW", "IT9ORA", "DJ2YH", "N2RDR", "K2TS", "9A3GO", "DL2SRN", "DL7VZF", "UU4JA", "CW5W",
	"DL3OAU", "RV3LU", "DL9MA", "EW7LO", "US3IZ", "DL9OCI", "RN3RA", "DK3YD", "YU7EA", "DL6NW",
	"4Z4DX", "HA9SB", "G3JTO", "W4IX", "W4SM", "WA1PFC", "W4HM", "W3TMZ", "HA5AF", "N4ZR",
	"OZ1SX", "DL2MA", "OM4DN", "RW4AA", "DL1SNO", "RW6FS", "OL7A", "IV3OQR", "RW3DW", "HA5JP",
	"UA6XGL/3", "WA1ITU", "HA1FU", "KA2HMJ", "DL7CF", "N4KDU", "IK9YUJ", "IV3TQE", "IN2B", "NP9DA",
	"OH2BDP", "G4IUZ", "LZ9A", "ES4AA", "IV3WRK", "RU4IAN", "SP5CTY", "G3GIQ", "F6EZV", "IK6BAK",
	"G3OCA", "UA9WZ", "SP2SPB", "K9AWC", "W3DA", "N3JFF", "F5RO", "GM3CIX", "VE3DW", "HA3MY",
	"SM3EVR", "DK0NT", "DL7VOX", "WV1C", "VE3WT", "UA4YG", "UN6P", "SM7MS", "HB9QA", "YZ1AU",
	"YU7FN", "OK2RU", "G0HGA", "DL6NBY", "DL6FDB", "DL6MBA", "YT7YA",
    ];
    return word_list("callsigns", words, table);
}

//
// could do ham abbreviations and prosigns, but the prosigns would need to be installed into the code table
//

//
// make the word_list for all combinations of characters sorted by dit length.
//
function word_list_comb(table) {
    function isLetter(x) {
	var ux = x.toUpperCase();
	var lx = x.toLowerCase();
	return ux != lx;
    }
    var MAX = 24;
    var singles = [], words = [], made = {};
    for (var i in table.code) {
	// console.log("letter "+i+" in table.code is "+table.code[i]);
	singles.push(i);
	words.push(i);
	made[i] = true;
    }
    // console.log("starting comb loop with "+words.length+" words");
    var nsing = singles.length;
    while (true) {
	var nwords = words.length;
	for (var i = 0; i < nsing; i += 1) {
	    var iword = singles[i];
	    if ( ! isLetter(iword)) continue;
	    var ilen = table.ditLength(iword);
	    for (var j = 0; j < nwords; j += 1) {
		var jword = words[j];
		if ( ! isLetter(jword)) continue;
		var jlen = table.ditLength(jword);
		if (ilen+2+jlen < MAX) {
		    if (! made[iword+jword]) {
			// console.log("make "+iword+jword);
			words.push(iword+jword);
			made[iword+jword] = true;
		    }
		    if (! made[jword+iword]) {
			// console.log("make "+jword+iword);
			words.push(jword+iword);
			made[jword+iword] = true;
		    }
		}
	    }
	}
	if (nwords == words.length) break;
	// console.log("added "+(words.length-nwords)+" words, "+words.length+" total");
    }
    return word_list('comb', words, table);
}

