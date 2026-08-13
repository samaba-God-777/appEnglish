export type FlashLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface FlashCard {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  translation: string;
  synonyms: string[];
  icon: string;
  color: string;
}

export interface FlashDeck {
  level: FlashLevel;
  title: string;
  description: string;
  cards: FlashCard[];
}

export const flashLevels: FlashLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const levelMeta: Record<FlashLevel, { title: string; description: string; color: string }> = {
  A1: { title: "Beginner", description: "Everyday words for absolute basics.", color: "from-emerald-400 to-teal-500" },
  A2: { title: "Elementary", description: "Common words for daily situations.", color: "from-teal-400 to-cyan-500" },
  B1: { title: "Intermediate", description: "Express opinions and handle real life.", color: "from-sky-400 to-blue-500" },
  B2: { title: "Upper-Intermediate", description: "Nuanced, precise vocabulary.", color: "from-indigo-400 to-violet-500" },
  C1: { title: "Advanced", description: "Academic and professional register.", color: "from-violet-400 to-purple-500" },
  C2: { title: "Proficiency", description: "Near-native, sophisticated words.", color: "from-fuchsia-400 to-pink-500" },
};

export const flashDecks: FlashDeck[] = [
  {
    level: "A1",
    title: "Beginner",
    description: "Everyday words for absolute basics.",
    cards: [
      { id: "a1-house", word: "house", phonetic: "/haʊs/", partOfSpeech: "noun", definition: "A building where people live.", example: "They live in a small house near the park.", translation: "casa", synonyms: ["home", "residence"], icon: "Home", color: "from-emerald-400 to-teal-500" },
      { id: "a1-water", word: "water", phonetic: "/ˈwɔː.tər/", partOfSpeech: "noun", definition: "The clear liquid that we drink.", example: "Can I have a glass of water, please?", translation: "agua", synonyms: ["liquid"], icon: "Droplet", color: "from-sky-400 to-blue-500" },
      { id: "a1-friend", word: "friend", phonetic: "/frend/", partOfSpeech: "noun", definition: "A person you know and like well.", example: "She is my best friend.", translation: "amigo", synonyms: ["mate", "pal"], icon: "Users", color: "from-amber-400 to-orange-500" },
      { id: "a1-happy", word: "happy", phonetic: "/ˈhæp.i/", partOfSpeech: "adjective", definition: "Feeling or showing pleasure.", example: "I'm so happy to see you!", translation: "feliz", synonyms: ["glad", "joyful"], icon: "Smile", color: "from-yellow-400 to-amber-500" },
      { id: "a1-eat", word: "eat", phonetic: "/iːt/", partOfSpeech: "verb", definition: "To put food in your mouth and swallow it.", example: "We eat dinner at seven.", translation: "comer", synonyms: ["consume", "have"], icon: "Utensils", color: "from-rose-400 to-red-500" },
      { id: "a1-big", word: "big", phonetic: "/bɪɡ/", partOfSpeech: "adjective", definition: "Large in size or amount.", example: "That's a big dog!", translation: "grande", synonyms: ["large", "huge"], icon: "Maximize", color: "from-teal-400 to-cyan-500" },
      { id: "a1-book", word: "book", phonetic: "/bʊk/", partOfSpeech: "noun", definition: "A set of printed pages you read.", example: "I'm reading a good book.", translation: "libro", synonyms: ["volume"], icon: "BookOpen", color: "from-indigo-400 to-blue-500" },
      { id: "a1-day", word: "day", phonetic: "/deɪ/", partOfSpeech: "noun", definition: "A period of 24 hours.", example: "Have a nice day!", translation: "día", synonyms: ["date"], icon: "Sun", color: "from-orange-400 to-yellow-500" },
    ],
  },
  {
    level: "A2",
    title: "Elementary",
    description: "Common words for daily situations.",
    cards: [
      { id: "a2-weather", word: "weather", phonetic: "/ˈweð.ər/", partOfSpeech: "noun", definition: "The condition of the air (rain, sun, wind).", example: "The weather is lovely today.", translation: "clima", synonyms: ["climate", "conditions"], icon: "CloudSun", color: "from-sky-400 to-blue-500" },
      { id: "a2-journey", word: "journey", phonetic: "/ˈdʒɜː.ni/", partOfSpeech: "noun", definition: "An act of travelling from one place to another.", example: "The journey took three hours.", translation: "viaje", synonyms: ["trip", "voyage"], icon: "Map", color: "from-emerald-400 to-teal-500" },
      { id: "a2-borrow", word: "borrow", phonetic: "/ˈbɒr.əʊ/", partOfSpeech: "verb", definition: "To take and use something you will return.", example: "Can I borrow your pen?", translation: "pedir prestado", synonyms: ["take", "loan"], icon: "HandCoins", color: "from-amber-400 to-orange-500" },
      { id: "a2-quiet", word: "quiet", phonetic: "/ˈkwaɪ.ət/", partOfSpeech: "adjective", definition: "Making little or no noise.", example: "Please be quiet in the library.", translation: "silencioso", synonyms: ["silent", "calm"], icon: "VolumeX", color: "from-indigo-400 to-violet-500" },
      { id: "a2-decide", word: "decide", phonetic: "/dɪˈsaɪd/", partOfSpeech: "verb", definition: "To choose after thinking about it.", example: "We decided to stay home.", translation: "decidir", synonyms: ["choose", "resolve"], icon: "SplitSquareHorizontal", color: "from-teal-400 to-cyan-500" },
      { id: "a2-careful", word: "careful", phonetic: "/ˈkeə.fəl/", partOfSpeech: "adjective", definition: "Giving attention to avoid mistakes or danger.", example: "Be careful with that knife.", translation: "cuidadoso", synonyms: ["cautious", "attentive"], icon: "ShieldAlert", color: "from-rose-400 to-red-500" },
      { id: "a2-arrive", word: "arrive", phonetic: "/əˈraɪv/", partOfSpeech: "verb", definition: "To reach a place.", example: "They arrived late.", translation: "llegar", synonyms: ["reach", "get in"], icon: "MapPin", color: "from-green-400 to-emerald-500" },
      { id: "a2-cheap", word: "cheap", phonetic: "/tʃiːp/", partOfSpeech: "adjective", definition: "Costing little money.", example: "These shoes were really cheap.", translation: "barato", synonyms: ["inexpensive", "affordable"], icon: "Tag", color: "from-yellow-400 to-amber-500" },
    ],
  },
  {
    level: "B1",
    title: "Intermediate",
    description: "Express opinions and handle real life.",
    cards: [
      { id: "b1-achieve", word: "achieve", phonetic: "/əˈtʃiːv/", partOfSpeech: "verb", definition: "To succeed in doing something after effort.", example: "She achieved her goal of running a marathon.", translation: "lograr", synonyms: ["accomplish", "attain"], icon: "Trophy", color: "from-amber-400 to-orange-500" },
      { id: "b1-opinion", word: "opinion", phonetic: "/əˈpɪn.jən/", partOfSpeech: "noun", definition: "A belief or judgement about something.", example: "In my opinion, the book was better.", translation: "opinión", synonyms: ["view", "belief"], icon: "MessageSquare", color: "from-sky-400 to-blue-500" },
      { id: "b1-environment", word: "environment", phonetic: "/ɪnˈvaɪ.rən.mənt/", partOfSpeech: "noun", definition: "The natural world; the conditions around us.", example: "We must protect the environment.", translation: "medio ambiente", synonyms: ["surroundings", "nature"], icon: "Leaf", color: "from-green-400 to-emerald-500" },
      { id: "b1-reliable", word: "reliable", phonetic: "/rɪˈlaɪ.ə.bəl/", partOfSpeech: "adjective", definition: "Able to be trusted to do what is expected.", example: "He is a reliable employee.", translation: "confiable", synonyms: ["dependable", "trustworthy"], icon: "BadgeCheck", color: "from-teal-400 to-cyan-500" },
      { id: "b1-suggest", word: "suggest", phonetic: "/səˈdʒest/", partOfSpeech: "verb", definition: "To mention an idea for others to consider.", example: "I suggest we leave early.", translation: "sugerir", synonyms: ["propose", "recommend"], icon: "Lightbulb", color: "from-yellow-400 to-amber-500" },
      { id: "b1-confident", word: "confident", phonetic: "/ˈkɒn.fɪ.dənt/", partOfSpeech: "adjective", definition: "Feeling sure about your ability.", example: "She felt confident before the exam.", translation: "seguro", synonyms: ["self-assured", "certain"], icon: "Sparkles", color: "from-indigo-400 to-violet-500" },
      { id: "b1-admit", word: "admit", phonetic: "/ədˈmɪt/", partOfSpeech: "verb", definition: "To agree that something is true, often reluctantly.", example: "He admitted his mistake.", translation: "admitir", synonyms: ["confess", "acknowledge"], icon: "CircleCheck", color: "from-rose-400 to-red-500" },
      { id: "b1-avoid", word: "avoid", phonetic: "/əˈvɔɪd/", partOfSpeech: "verb", definition: "To keep away from something.", example: "Try to avoid junk food.", translation: "evitar", synonyms: ["prevent", "dodge"], icon: "Ban", color: "from-fuchsia-400 to-pink-500" },
    ],
  },
  {
    level: "B2",
    title: "Upper-Intermediate",
    description: "Nuanced, precise vocabulary.",
    cards: [
      { id: "b2-resilient", word: "resilient", phonetic: "/rɪˈzɪl.i.ənt/", partOfSpeech: "adjective", definition: "Able to recover quickly from difficulties.", example: "She is resilient and never gives up.", translation: "resiliente", synonyms: ["tough", "adaptable"], icon: "ShieldCheck", color: "from-teal-400 to-emerald-500" },
      { id: "b2-thorough", word: "thorough", phonetic: "/ˈθʌr.ə/", partOfSpeech: "adjective", definition: "Detailed and careful, leaving nothing out.", example: "The doctor gave him a thorough examination.", translation: "minucioso", synonyms: ["exhaustive", "meticulous"], icon: "ListChecks", color: "from-sky-400 to-blue-500" },
      { id: "b2-reluctant", word: "reluctant", phonetic: "/rɪˈlʌk.tənt/", partOfSpeech: "adjective", definition: "Not willing and therefore slow to act.", example: "He was reluctant to admit his mistake.", translation: "reacio", synonyms: ["unwilling", "hesitant"], icon: "CircleSlash", color: "from-rose-400 to-red-500" },
      { id: "b2-insight", word: "insight", phonetic: "/ˈɪn.saɪt/", partOfSpeech: "noun", definition: "A clear, deep understanding of something.", example: "The report gave us new insight.", translation: "perspicacia", synonyms: ["understanding", "perception"], icon: "Lightbulb", color: "from-yellow-400 to-amber-500" },
      { id: "b2-significant", word: "significant", phonetic: "/sɪɡˈnɪf.ɪ.kənt/", partOfSpeech: "adjective", definition: "Large or important enough to have an effect.", example: "There was a significant increase in sales.", translation: "significativo", synonyms: ["important", "notable"], icon: "TrendingUp", color: "from-green-400 to-teal-500" },
      { id: "b2-deteriorate", word: "deteriorate", phonetic: "/dɪˈtɪə.ri.ə.reɪt/", partOfSpeech: "verb", definition: "To become progressively worse.", example: "Her health began to deteriorate.", translation: "deteriorarse", synonyms: ["worsen", "decline"], icon: "TrendingDown", color: "from-orange-400 to-red-500" },
      { id: "b2-accurate", word: "accurate", phonetic: "/ˈæk.jər.ət/", partOfSpeech: "adjective", definition: "Correct, exact and without mistakes.", example: "The forecast was surprisingly accurate.", translation: "preciso", synonyms: ["precise", "exact"], icon: "Crosshair", color: "from-cyan-400 to-sky-500" },
      { id: "b2-nevertheless", word: "nevertheless", phonetic: "/ˌnev.əˈðel.es/", partOfSpeech: "adverb", definition: "Despite what has just been said; however.", example: "It was raining; nevertheless, we went out.", translation: "sin embargo", synonyms: ["nonetheless", "still"], icon: "Split", color: "from-indigo-400 to-blue-500" },
    ],
  },
  {
    level: "C1",
    title: "Advanced",
    description: "Academic and professional register.",
    cards: [
      { id: "c1-meticulous", word: "meticulous", phonetic: "/məˈtɪk.jə.ləs/", partOfSpeech: "adjective", definition: "Very careful and precise about small details.", example: "He kept meticulous records of every transaction.", translation: "meticuloso", synonyms: ["scrupulous", "painstaking"], icon: "ScanSearch", color: "from-violet-400 to-purple-500" },
      { id: "c1-ambiguous", word: "ambiguous", phonetic: "/æmˈbɪɡ.ju.əs/", partOfSpeech: "adjective", definition: "Having more than one possible meaning.", example: "The instructions were ambiguous and confusing.", translation: "ambiguo", synonyms: ["unclear", "vague"], icon: "HelpCircle", color: "from-amber-400 to-orange-500" },
      { id: "c1-inevitable", word: "inevitable", phonetic: "/ɪˈnev.ɪ.tə.bəl/", partOfSpeech: "adjective", definition: "Certain to happen; unavoidable.", example: "Change is inevitable in any organisation.", translation: "inevitable", synonyms: ["unavoidable", "certain"], icon: "Milestone", color: "from-sky-400 to-blue-500" },
      { id: "c1-pragmatic", word: "pragmatic", phonetic: "/præɡˈmæt.ɪk/", partOfSpeech: "adjective", definition: "Dealing with problems in a practical, realistic way.", example: "We need a pragmatic approach, not idealism.", translation: "pragmático", synonyms: ["practical", "realistic"], icon: "Wrench", color: "from-teal-400 to-cyan-500" },
      { id: "c1-scrutinize", word: "scrutinize", phonetic: "/ˈskruː.tɪ.naɪz/", partOfSpeech: "verb", definition: "To examine something very carefully.", example: "Auditors scrutinized the accounts.", translation: "escudriñar", synonyms: ["examine", "inspect"], icon: "Search", color: "from-indigo-400 to-violet-500" },
      { id: "c1-coherent", word: "coherent", phonetic: "/kəʊˈhɪə.rənt/", partOfSpeech: "adjective", definition: "Logical, clear and well organised.", example: "She presented a coherent argument.", translation: "coherente", synonyms: ["logical", "consistent"], icon: "Link", color: "from-green-400 to-emerald-500" },
      { id: "c1-nuance", word: "nuance", phonetic: "/ˈnjuː.ɑːns/", partOfSpeech: "noun", definition: "A very slight difference in meaning or tone.", example: "He appreciated the nuances of the poem.", translation: "matiz", synonyms: ["subtlety", "shade"], icon: "Palette", color: "from-fuchsia-400 to-pink-500" },
      { id: "c1-mitigate", word: "mitigate", phonetic: "/ˈmɪt.ɪ.ɡeɪt/", partOfSpeech: "verb", definition: "To make something less severe or harmful.", example: "Steps were taken to mitigate the risk.", translation: "mitigar", synonyms: ["reduce", "alleviate"], icon: "ShieldMinus", color: "from-rose-400 to-red-500" },
    ],
  },
  {
    level: "C2",
    title: "Proficiency",
    description: "Near-native, sophisticated words.",
    cards: [
      { id: "c2-ubiquitous", word: "ubiquitous", phonetic: "/juːˈbɪk.wɪ.təs/", partOfSpeech: "adjective", definition: "Present, appearing or found everywhere.", example: "Smartphones are now ubiquitous.", translation: "ubicuo", synonyms: ["omnipresent", "pervasive"], icon: "Globe", color: "from-fuchsia-400 to-pink-500" },
      { id: "c2-quintessential", word: "quintessential", phonetic: "/ˌkwɪn.tɪˈsen.ʃəl/", partOfSpeech: "adjective", definition: "Representing the most perfect example of a quality.", example: "He is the quintessential English gentleman.", translation: "quintaesencial", synonyms: ["archetypal", "definitive"], icon: "Gem", color: "from-violet-400 to-purple-500" },
      { id: "c2-ephemeral", word: "ephemeral", phonetic: "/ɪˈfem.ər.əl/", partOfSpeech: "adjective", definition: "Lasting for a very short time.", example: "Fame can be ephemeral.", translation: "efímero", synonyms: ["fleeting", "transient"], icon: "Hourglass", color: "from-sky-400 to-blue-500" },
      { id: "c2-juxtapose", word: "juxtapose", phonetic: "/ˌdʒʌk.stəˈpəʊz/", partOfSpeech: "verb", definition: "To place things side by side for contrast.", example: "The film juxtaposes wealth and poverty.", translation: "yuxtaponer", synonyms: ["contrast", "compare"], icon: "Columns2", color: "from-amber-400 to-orange-500" },
      { id: "c2-esoteric", word: "esoteric", phonetic: "/ˌes.əˈter.ɪk/", partOfSpeech: "adjective", definition: "Understood by only a small, specialised group.", example: "The lecture was full of esoteric jargon.", translation: "esotérico", synonyms: ["obscure", "arcane"], icon: "KeyRound", color: "from-indigo-400 to-violet-500" },
      { id: "c2-perfunctory", word: "perfunctory", phonetic: "/pəˈfʌŋk.tər.i/", partOfSpeech: "adjective", definition: "Done quickly, without care or interest.", example: "He gave a perfunctory nod and left.", translation: "superficial", synonyms: ["cursory", "hasty"], icon: "FastForward", color: "from-teal-400 to-cyan-500" },
      { id: "c2-idiosyncratic", word: "idiosyncratic", phonetic: "/ˌɪd.i.ə.sɪŋˈkræt.ɪk/", partOfSpeech: "adjective", definition: "Peculiar to an individual; distinctive.", example: "Her idiosyncratic style is instantly recognisable.", translation: "idiosincrásico", synonyms: ["distinctive", "peculiar"], icon: "Fingerprint", color: "from-green-400 to-emerald-500" },
      { id: "c2-ostensible", word: "ostensible", phonetic: "/ɒsˈten.sə.bəl/", partOfSpeech: "adjective", definition: "Stated as true but perhaps not the real reason.", example: "The ostensible purpose of the trip was business.", translation: "aparente", synonyms: ["apparent", "purported"], icon: "Eye", color: "from-rose-400 to-red-500" },
    ],
  },
];

export function getDeck(level: FlashLevel): FlashDeck | undefined {
  return flashDecks.find((d) => d.level === level);
}
