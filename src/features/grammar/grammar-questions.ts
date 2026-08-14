export interface GrammarQuestion {
  id: string;
  topicId: string;
  kind: "mcq" | "gapfill";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export type GrammarMode = "activity" | "test" | "assignment";

const Q: GrammarQuestion[] = [
  // ─────────────────────────── PRESENT SIMPLE ───────────────────────────
  { id: "ps1", topicId: "present-simple", kind: "gapfill", prompt: "She ___ to work every morning.", options: ["go", "goes", "going", "is going"], correctIndex: 1, explanation: "Third person singular (he/she/it) adds -s: go → goes." },
  { id: "ps2", topicId: "present-simple", kind: "gapfill", prompt: "Water ___ at 100 degrees.", options: ["boils", "boil", "is boiling", "is boil"], correctIndex: 0, explanation: "A general truth uses the Present Simple: boil → boils." },
  { id: "ps3", topicId: "present-simple", kind: "gapfill", prompt: "___ they live near here?", options: ["Do", "Does", "Is", "Are"], correctIndex: 0, explanation: "Questions with 'they' use 'do': Do they live…?" },
  { id: "ps4", topicId: "present-simple", kind: "mcq", prompt: "Which is the correct sentence for a timetable?", options: ["The train leaves at 6 p.m.", "The train leave at 6 p.m.", "The train left at 6 p.m.", "The train has left at 6 p.m."], correctIndex: 0, explanation: "Timetables (fixed future) use the Present Simple: leaves." },
  { id: "ps5", topicId: "present-simple", kind: "mcq", prompt: "Which verb is NOT normally used in the continuous?", options: ["run", "know", "play", "watch"], correctIndex: 1, explanation: "'Know' is a stative verb — it stays in the Present Simple." },
  { id: "ps6", topicId: "present-simple", kind: "mcq", prompt: "Choose the correct sentence.", options: ["I don't like this song.", "I doesn't like this song.", "I not like this song.", "I am not like this song."], correctIndex: 0, explanation: "Negative with 'I' uses don't + base verb." },
  { id: "ps7", topicId: "present-simple", kind: "gapfill", prompt: "He ___ breakfast at 7 a.m. every day.", options: ["eats", "eat", "is eating", "eating"], correctIndex: 0, explanation: "Third person singular: eat → eats." },
  { id: "ps8", topicId: "present-simple", kind: "gapfill", prompt: "___ she speak French?", options: ["Does", "Do", "Is", "Has"], correctIndex: 0, explanation: "Questions with 'she' use 'does': Does she speak…?" },
  { id: "ps9", topicId: "present-simple", kind: "gapfill", prompt: "They ___ TV every evening.", options: ["watch", "watches", "are watching", "watching"], correctIndex: 0, explanation: "Plural subject (they) uses the base form: watch." },
  { id: "ps10", topicId: "present-simple", kind: "mcq", prompt: "Which is correct?", options: ["My mother works at a bank.", "My mother work at a bank.", "My mother is work at a bank.", "My mother working at a bank."], correctIndex: 0, explanation: "Third person singular: work → works." },
  { id: "ps11", topicId: "present-simple", kind: "gapfill", prompt: "I ___ not like spicy food.", options: ["do", "does", "am", "have"], correctIndex: 0, explanation: "Negative with 'I' uses 'do not'." },
  { id: "ps12", topicId: "present-simple", kind: "mcq", prompt: "Choose the correct question form.", options: ["Do you like chocolate?", "Does you like chocolate?", "Are you like chocolate?", "Do you likes chocolate?"], correctIndex: 0, explanation: "Questions with 'you' use 'do': Do you like…?" },
  { id: "ps13", topicId: "present-simple", kind: "gapfill", prompt: "The sun ___ in the east.", options: ["rises", "rise", "is rising", "rose"], correctIndex: 0, explanation: "General truth: the sun rises." },
  { id: "ps14", topicId: "present-simple", kind: "gapfill", prompt: "We ___ to the gym on Mondays.", options: ["go", "goes", "are going", "going"], correctIndex: 0, explanation: "Plural subject (we) uses base form: go." },
  { id: "ps15", topicId: "present-simple", kind: "mcq", prompt: "Which sentence is correct?", options: ["She doesn't have a car.", "She doesn't has a car.", "She don't have a car.", "She not have a car."], correctIndex: 0, explanation: "Negative with 'she' uses 'doesn't' + base form." },
  { id: "ps16", topicId: "present-simple", kind: "gapfill", prompt: "My father ___ the newspaper every morning.", options: ["reads", "read", "is reading", "reading"], correctIndex: 0, explanation: "Third person singular: read → reads." },
  { id: "ps17", topicId: "present-simple", kind: "mcq", prompt: "Which is a stative verb?", options: ["believe", "run", "jump", "swim"], correctIndex: 0, explanation: "'Believe' is stative — it describes a state, not an action." },
  { id: "ps18", topicId: "present-simple", kind: "gapfill", prompt: "___ it rain a lot in your country?", options: ["Does", "Do", "Is", "Has"], correctIndex: 0, explanation: "Questions with 'it' use 'does': Does it rain…?" },
  { id: "ps19", topicId: "present-simple", kind: "gapfill", prompt: "The children ___ in the garden.", options: ["play", "plays", "are playing", "played"], correctIndex: 0, explanation: "Plural subject (children) uses base form: play." },
  { id: "ps20", topicId: "present-simple", kind: "mcq", prompt: "Choose the correct sentence.", options: ["He studies English every day.", "He study English every day.", "He is study English every day.", "He studys English every day."], correctIndex: 0, explanation: "Third person singular: study → studies (consonant + y → ies)." },
  { id: "ps21", topicId: "present-simple", kind: "gapfill", prompt: "I ___ coffee but I ___ tea.", options: ["like … don't like", "likes … doesn't like", "am liking … not liking", "liked … didn't like"], correctIndex: 0, explanation: "'I' uses 'like' and 'don't like' (base form)." },
  { id: "ps22", topicId: "present-simple", kind: "mcq", prompt: "Which is correct?", options: ["The bus arrives at 9 a.m.", "The bus arrive at 9 a.m.", "The bus is arrive at 9 a.m.", "The bus arriving at 9 a.m."], correctIndex: 0, explanation: "Timetables use Present Simple: arrives (third person)." },
  { id: "ps23", topicId: "present-simple", kind: "gapfill", prompt: "My sister ___ her homework after school.", options: ["does", "do", "is doing", "did"], correctIndex: 0, explanation: "Third person singular: do → does." },
  { id: "ps24", topicId: "present-simple", kind: "gapfill", prompt: "He ___ like cold weather.", options: ["doesn't", "don't", "isn't", "hasn't"], correctIndex: 0, explanation: "Negative with 'he' uses 'doesn't' + base form." },
  { id: "ps25", topicId: "present-simple", kind: "mcq", prompt: "Choose the correct sentence.", options: ["Fish live in water.", "Fish lives in water.", "Fish are living in water.", "Fish is live in water."], correctIndex: 0, explanation: "General truths use Present Simple. Fish (plural) → live." },
  { id: "ps26", topicId: "present-simple", kind: "gapfill", prompt: "___ he work in an office?", options: ["Does", "Do", "Is", "Has"], correctIndex: 0, explanation: "Questions with 'he' use 'does': Does he work…?" },

  // ───────────────────────── PRESENT CONTINUOUS ─────────────────────────
  { id: "pc1", topicId: "present-continuous", kind: "gapfill", prompt: "She ___ reading a book right now.", options: ["is", "are", "am", "be"], correctIndex: 0, explanation: "Present Continuous for an action right now: She is reading." },
  { id: "pc2", topicId: "present-continuous", kind: "gapfill", prompt: "Look! They ___ football.", options: ["play", "are playing", "is playing", "plays"], correctIndex: 1, explanation: "'Look!' signals an action happening now — use the continuous." },
  { id: "pc3", topicId: "present-continuous", kind: "gapfill", prompt: "___(noise) you ___ to me?", options: ["Are … listening", "Do … listen", "Is … listening", "Does … listen"], correctIndex: 0, explanation: "Yes/no continuous question: Are you listening…?" },
  { id: "pc4", topicId: "present-continuous", kind: "gapfill", prompt: "We ___ John tomorrow (planned meeting).", options: ["are meeting", "meet", "meets", "have met"], correctIndex: 0, explanation: "Fixed future arrangements use the Present Continuous: are meeting." },
  { id: "pc5", topicId: "present-continuous", kind: "mcq", prompt: "Which spelling is correct?", options: ["makeing", "making", "makeeing", "makking"], correctIndex: 1, explanation: "Drop the silent -e before -ing: make → making." },
  { id: "pc6", topicId: "present-continuous", kind: "mcq", prompt: "Which verb is usually NOT used in the continuous?", options: ["run", "sit", "believe", "swim"], correctIndex: 2, explanation: "'Believe' is stative: I believe (not 'am believing')." },

  // ────────────────────────── PRESENT PERFECT ──────────────────────────
  { id: "pp1", topicId: "present-perfect", kind: "gapfill", prompt: "I ___ my keys, so I can't get in.", options: ["have lost", "lost", "lose", "am losing"], correctIndex: 0, explanation: "A past action with a present result uses the Present Perfect." },
  { id: "pp2", topicId: "present-perfect", kind: "gapfill", prompt: "Have you ever ___ to Japan?", options: ["been", "went", "gone to go", "be"], correctIndex: 0, explanation: "'Ever' + life experience takes been (past participle)." },
  { id: "pp3", topicId: "present-perfect", kind: "gapfill", prompt: "He ___ already finished his homework.", options: ["has", "have", "is", "will"], correctIndex: 0, explanation: "'Already' + he → has finished." },
  { id: "pp4", topicId: "present-perfect", kind: "gapfill", prompt: "I haven't seen that film ___.", options: ["yet", "yesterday", "last week", "ago"], correctIndex: 0, explanation: "'Yet' is used with the Present Perfect in negatives and questions." },
  { id: "pp5", topicId: "present-perfect", kind: "mcq", prompt: "Choose the correct sentence.", options: ["She has lived here for three years.", "She has lived here since three years.", "She lived here for three years ago.", "She is living since three years."], correctIndex: 0, explanation: "'For' + a duration is correct: for three years." },
  { id: "pp6", topicId: "present-perfect", kind: "mcq", prompt: "Which is WRONG with the Present Perfect?", options: ["I have never been abroad.", "Have you finished yet?", "I have seen him yesterday.", "She has just left."], correctIndex: 2, explanation: "'Yesterday' (finished time) needs Past Simple, not Present Perfect." },

  // ─────────────────── PRESENT PERFECT CONTINUOUS ───────────────────
  { id: "ppc1", topicId: "present-perfect-continuous", kind: "gapfill", prompt: "I have been ___ for three hours.", options: ["studying", "studied", "study", "studies"], correctIndex: 0, explanation: "Emphasis on duration uses been + verb-ing." },
  { id: "ppc2", topicId: "present-perfect-continuous", kind: "gapfill", prompt: "It has been ___ all day.", options: ["raining", "rained", "rain", "rains"], correctIndex: 0, explanation: "The continuous shows the action is still going on." },
  { id: "ppc3", topicId: "present-perfect-continuous", kind: "gapfill", prompt: "How long ___ you been waiting?", options: ["have", "has", "are", "do"], correctIndex: 0, explanation: "'How long' + have + subject + been + verb-ing." },
  { id: "ppc4", topicId: "present-perfect-continuous", kind: "mcq", prompt: "You're tired because you ___ running.", options: ["have been", "has been", "are been", "been"], correctIndex: 0, explanation: "A recent activity with a visible result → have been running." },
  { id: "ppc5", topicId: "present-perfect-continuous", kind: "mcq", prompt: "Which sentence is correct?", options: ["I've known him for years.", "I've been knowing him for years.", "I know him for years.", "I am knowing him for years."], correctIndex: 0, explanation: "Stative verbs ('know') do not take the continuous form." },
  { id: "ppc6", topicId: "present-perfect-continuous", kind: "mcq", prompt: "She ___ here since May (emphasis on how long).", options: ["has been working", "have been working", "worked", "is working"], correctIndex: 0, explanation: "Duration since a point in time → Present Perfect Continuous." },

  // ─────────────────────────── PAST SIMPLE ───────────────────────────
  { id: "past1", topicId: "past-simple", kind: "gapfill", prompt: "I ___ Rome in 2019.", options: ["visited", "visit", "have visited", "am visiting"], correctIndex: 0, explanation: "A finished action at a definite past time → Past Simple." },
  { id: "past2", topicId: "past-simple", kind: "gapfill", prompt: "___ he call you last night?", options: ["Did", "Does", "Has", "Was"], correctIndex: 0, explanation: "Past questions use Did + base verb." },
  { id: "past3", topicId: "past-simple", kind: "gapfill", prompt: "They ___ a film last night.", options: ["watched", "watch", "have watched", "are watching"], correctIndex: 0, explanation: "Last night = a finished time → watched." },
  { id: "past4", topicId: "past-simple", kind: "mcq", prompt: "Which is the correct past form?", options: ["goed", "went", "go", "gone"], correctIndex: 1, explanation: "'Go' is irregular: go → went." },
  { id: "past5", topicId: "past-simple", kind: "mcq", prompt: "Choose the correct sentence.", options: ["We played outside every summer when I was young.", "We play outside every summer when I was young.", "We have played outside every summer when I was young.", "We are playing outside every summer when I was young."], correctIndex: 0, explanation: "A past habit uses the Past Simple." },
  { id: "past6", topicId: "past-simple", kind: "gapfill", prompt: "He didn't ___ me yesterday.", options: ["call", "called", "calls", "calling"], correctIndex: 0, explanation: "After did/didn't the main verb returns to base form." },

  // ───────────────────────── PAST CONTINUOUS ─────────────────────────
  { id: "pastc1", topicId: "past-continuous", kind: "gapfill", prompt: "At 8 p.m. I ___ having dinner.", options: ["was", "were", "am", "had"], correctIndex: 0, explanation: "An action in progress at a past time → Past Continuous: was having." },
  { id: "pastc2", topicId: "past-continuous", kind: "gapfill", prompt: "I was cooking when the phone ___.", options: ["rang", "rings", "was ringing", "is ringing"], correctIndex: 0, explanation: "The interruption is Past Simple (rang); the long action is continuous." },
  { id: "pastc3", topicId: "past-continuous", kind: "gapfill", prompt: "They ___ waiting for the bus when it rained.", options: ["were", "was", "are", "have been"], correctIndex: 0, explanation: "Plural subject → were waiting." },
  { id: "pastc4", topicId: "past-continuous", kind: "mcq", prompt: "Which pair is correct for two parallel past actions?", options: ["She was reading while he was cooking.", "She read while he was cooking, done.", "She was read while he was cook.", "She reading while he cooking."], correctIndex: 0, explanation: "While + Past Continuous on both sides for parallel actions." },
  { id: "pastc5", topicId: "past-continuous", kind: "gapfill", prompt: "What ___ you doing at midnight?", options: ["were", "was", "are", "did"], correctIndex: 0, explanation: "Question form: Were + subject + verb-ing." },
  { id: "pastc6", topicId: "past-continuous", kind: "mcq", prompt: "Which would NOT use the Past Continuous?", options: ["know the answer", "wait for the bus", "read a book", "have dinner"], correctIndex: 0, explanation: "'Know' is stative — use Past Simple: 'I knew the answer'." },

  // ─────────────────────────── PAST PERFECT ───────────────────────────
  { id: "pastp1", topicId: "past-perfect", kind: "gapfill", prompt: "The train ___ left before we arrived.", options: ["had", "have", "has", "was"], correctIndex: 0, explanation: "The earlier of two past actions → Past Perfect: had left." },
  { id: "pastp2", topicId: "past-perfect", kind: "gapfill", prompt: "She was upset because she ___ failed.", options: ["had", "has", "did", "was"], correctIndex: 0, explanation: "The cause (had failed) happened before her being upset." },
  { id: "pastp3", topicId: "past-perfect", kind: "gapfill", prompt: "By 10 a.m. they ___ sold everything.", options: ["had", "have", "were", "did"], correctIndex: 0, explanation: "'By' a past time → Past Perfect: had sold." },
  { id: "pastp4", topicId: "past-perfect", kind: "mcq", prompt: "Choose the correct sentence.", options: ["I hadn't met him before that day.", "I didn't meet him before that day, earlier.", "I haven't met him before that day.", "I wasn't meet him before that day."], correctIndex: 0, explanation: "Before a past point → hadn't + past participle." },
  { id: "pastp5", topicId: "past-perfect", kind: "gapfill", prompt: "He said he ___ finished.", options: ["had", "has", "have", "will"], correctIndex: 0, explanation: "Reported speech backshift of Present Perfect → Past Perfect." },
  { id: "pastp6", topicId: "past-perfect", kind: "mcq", prompt: "Which is correct?", options: ["After she left, we ate.", "After she had left, we had ate.", "After she left, we have ate.", "After she had left, we have been ate."], correctIndex: 0, explanation: "With 'after' the sequence is clear, so Past Simple is fine." },

  // ─────────────────────── PAST PERFECT CONTINUOUS ───────────────────────
  { id: "pastpc1", topicId: "past-perfect-continuous", kind: "gapfill", prompt: "She ___ been working here for ten years when it closed.", options: ["had", "has", "have", "was"], correctIndex: 0, explanation: "Duration up to a past point → had been working." },
  { id: "pastpc2", topicId: "past-perfect-continuous", kind: "gapfill", prompt: "He was tired because he ___ running.", options: ["had been", "has been", "have been", "was been"], correctIndex: 0, explanation: "Past cause with continuous emphasis → had been running." },
  { id: "pastpc3", topicId: "past-perfect-continuous", kind: "gapfill", prompt: "How long had you ___ waiting when the bus came?", options: ["been", "be", "was", "have"], correctIndex: 0, explanation: "Had + subject + been + verb-ing." },
  { id: "pastpc4", topicId: "past-perfect-continuous", kind: "mcq", prompt: "Choose the correct sentence.", options: ["I hadn't been sleeping well.", "I haven't been sleeping well.", "I wasn't been sleeping well.", "I hadn't was sleeping well."], correctIndex: 0, explanation: "Neg: had + not + been + verb-ing." },
  { id: "pastpc5", topicId: "past-perfect-continuous", kind: "mcq", prompt: "Which is correct?", options: ["She had written five reports by then.", "She had been writing five reports by then.", "She written had five reports.", "She had had writing five reports."], correctIndex: 0, explanation: "With a stated quantity, use Past Perfect Simple, not continuous." },
  { id: "pastpc6", topicId: "past-perfect-continuous", kind: "mcq", prompt: "Which verb does NOT take the continuous here?", options: ["had known", "had been working", "had been sleeping", "had been running"], correctIndex: 0, explanation: "Stative verbs use Past Perfect Simple: 'had known'." },

  // ─────────────────────────── FUTURE (WILL) ───────────────────────────
  { id: "fw1", topicId: "future-will", kind: "gapfill", prompt: "I think it ___ rain tomorrow.", options: ["will", "is going", "does", "shall"], correctIndex: 0, explanation: "A prediction based on opinion uses 'will'." },
  { id: "fw2", topicId: "future-will", kind: "mcq", prompt: "An instant decision made at the moment of speaking uses:", options: ["will (I'll help you)", "going to (decided earlier)", "present simple", "present perfect"], correctIndex: 0, explanation: "Instant decisions → 'will'." },
  { id: "fw3", topicId: "future-will", kind: "mcq", prompt: "Which is a promise?", options: ["I'll always love you.", "I love you.", "I loved you.", "I have loved you."], correctIndex: 0, explanation: "Promises and offers use 'will'." },
  { id: "fw4", topicId: "future-will", kind: "gapfill", prompt: "He won't ___ to the party.", options: ["come", "comes", "coming", "came"], correctIndex: 0, explanation: "Won't + base verb: come." },
  { id: "fw5", topicId: "future-will", kind: "mcq", prompt: "Which sentence is correct?", options: ["When I get home, I'll call you.", "When I will get home, I'll call you.", "When I get home, I will have calling you.", "When I got home, I call you."], correctIndex: 0, explanation: "After 'when', use the present — not 'will'." },
  { id: "fw6", topicId: "future-will", kind: "mcq", prompt: "Choose the correct question.", options: ["Will you marry me?", "Do you will marry me?", "You will marry me?", "Are you will marry me?"], correctIndex: 0, explanation: "Will + subject + base verb." },

  // ─────────────────────────── FUTURE GOING TO ───────────────────────────
  { id: "fg1", topicId: "future-going-to", kind: "gapfill", prompt: "We ___ going to buy a house.", options: ["are", "is", "will", "do"], correctIndex: 0, explanation: "Plans already decided → am/is/are going to." },
  { id: "fg2", topicId: "future-going-to", kind: "gapfill", prompt: "Look at those clouds — it ___ going to rain.", options: ["is", "are", "will", "does"], correctIndex: 0, explanation: "A prediction from present evidence → is going to rain." },
  { id: "fg3", topicId: "future-going-to", kind: "gapfill", prompt: "I'm ___ to study medicine.", options: ["going", "go", "will", "went"], correctIndex: 0, explanation: "going to + base verb: going to study." },
  { id: "fg4", topicId: "future-going-to", kind: "gapfill", prompt: "She isn't ___ to accept the offer.", options: ["going", "go", "will", "went"], correctIndex: 0, explanation: "Not going to → isn't going to." },
  { id: "fg5", topicId: "future-going-to", kind: "gapfill", prompt: "Are you ___ to tell him?", options: ["going", "go", "will", "went"], correctIndex: 0, explanation: "Question form: Am/Is/Are + subject + going to." },
  { id: "fg6", topicId: "future-going-to", kind: "mcq", prompt: "Which uses 'going to' correctly?", options: ["We are going to see a film.", "We will going to see a film.", "We are go to see a film.", "We going to see a film."], correctIndex: 0, explanation: "am/is/are + going to + base verb." },

  // ────────────────────────── FUTURE CONTINUOUS ──────────────────────────
  { id: "fc1", topicId: "future-continuous", kind: "gapfill", prompt: "This time tomorrow I'll be ___ to Paris.", options: ["flying", "fly", "flies", "have flown"], correctIndex: 0, explanation: "In progress at a future moment → will be + verb-ing." },
  { id: "fc2", topicId: "future-continuous", kind: "gapfill", prompt: "They'll ___ waiting for us.", options: ["be", "is", "are", "have"], correctIndex: 0, explanation: "Will + be + verb-ing." },
  { id: "fc3", topicId: "future-continuous", kind: "gapfill", prompt: "What ___ you be doing at noon?", options: ["will", "are", "do", "have"], correctIndex: 0, explanation: "Question: Will + subject + be + verb-ing." },
  { id: "fc4", topicId: "future-continuous", kind: "gapfill", prompt: "He won't be ___ next week.", options: ["working", "work", "works", "worked"], correctIndex: 0, explanation: "Won't + be + verb-ing." },
  { id: "fc5", topicId: "future-continuous", kind: "mcq", prompt: "Which sentence is a polite enquiry about plans?", options: ["Will you be using the car tonight?", "Do you be using the car?", "Are you using the car tomorrow, yes?", "You will using the car?"], correctIndex: 0, explanation: "Future Continuous is used for polite enquiries about future plans." },
  { id: "fc6", topicId: "future-continuous", kind: "mcq", prompt: "Which is correct?", options: ["I'll be seeing her at the meeting.", "I'll seeing her at the meeting.", "I'll be see her at the meeting.", "I see will her at the meeting."], correctIndex: 0, explanation: "Expected future event → will be + verb-ing." },

  // ─────────────────────────── FUTURE PERFECT ───────────────────────────
  { id: "fp1", topicId: "future-perfect", kind: "gapfill", prompt: "By 2030 they ___ have finished the bridge.", options: ["will", "are", "have", "will be"], correctIndex: 0, explanation: "Completed by a future deadline → will have + past participle." },
  { id: "fp2", topicId: "future-perfect", kind: "gapfill", prompt: "I will have ___ by June.", options: ["graduated", "graduate", "graduating", "graduation"], correctIndex: 0, explanation: "Will have + past participle: graduated." },
  { id: "fp3", topicId: "future-perfect", kind: "gapfill", prompt: "Will you have ___ the report by Friday?", options: ["completed", "complete", "completing", "completes"], correctIndex: 0, explanation: "Question: Will + subject + have + past participle." },
  { id: "fp4", topicId: "future-perfect", kind: "gapfill", prompt: "She ___ have arrived by now.", options: ["will", "is", "has", "be"], correctIndex: 0, explanation: "Assumption about the recent past → will have arrived." },
  { id: "fp5", topicId: "future-perfect", kind: "mcq", prompt: "Choose the correct sentence.", options: ["By 10 they will have left.", "By 10 they will left.", "By 10 they have will left.", "By 10 they will be left."], correctIndex: 0, explanation: "will + have + past participle: will have left." },
  { id: "fp6", topicId: "future-perfect", kind: "mcq", prompt: "Which is correct for 'by the time'?", options: ["By the time you arrive, I'll have cooked dinner.", "By the time you will arrive, I'll have cooked.", "By the time you arrived, I'll have cooked.", "By the time you arrive, I'll cook have dinner."], correctIndex: 0, explanation: "After by the time use the present simple; the main verb is Future Perfect." },

  // ──────────────────── FUTURE PERFECT CONTINUOUS ────────────────────
  { id: "fpc1", topicId: "future-perfect-continuous", kind: "gapfill", prompt: "By May I ___ have been working here for ten years.", options: ["will", "have", "am", "was"], correctIndex: 0, explanation: "will + have been + verb-ing → duration up to a future point." },
  { id: "fpc2", topicId: "future-perfect-continuous", kind: "gapfill", prompt: "He'll have been ___ all night.", options: ["travelling", "travel", "travelled", "travels"], correctIndex: 0, explanation: "Cause of a future situation → will have been + verb-ing." },
  { id: "fpc3", topicId: "future-perfect-continuous", kind: "gapfill", prompt: "Will he have been ___ long enough to pass?", options: ["studying", "study", "studied", "studies"], correctIndex: 0, explanation: "Question: Will + have been + verb-ing." },
  { id: "fpc4", topicId: "future-perfect-continuous", kind: "mcq", prompt: "Choose the correct sentence.", options: ["By 2026 they will have been building it for a decade.", "By 2026 they will be building for a decade.", "By 2026 they have will been building.", "By 2026 they will have build for a decade."], correctIndex: 0, explanation: "Future with duration → will have been + verb-ing." },
  { id: "fpc5", topicId: "future-perfect-continuous", kind: "mcq", prompt: "Which sentence is correct?", options: ["I'll have been waiting for two hours by then.", "I'll been waiting for two hours by then.", "I'll have been wait for two hours by then.", "I'll be have waiting for two hours by then."], correctIndex: 0, explanation: "Emphasis on duration up to a future point → will have been + verb-ing." },
  { id: "fpc6", topicId: "future-perfect-continuous", kind: "gapfill", prompt: "By Friday she ___ have been working here for a month.", options: ["will", "has", "is", "be"], correctIndex: 0, explanation: "will + have been + verb-ing → duration up to a future point." },

  // ─────────────────────────── CONDITIONALS ───────────────────────────
  { id: "cond1", topicId: "conditionals", kind: "gapfill", prompt: "If you heat ice, it ___.", options: ["melts", "will melt", "would melt", "melt"], correctIndex: 0, explanation: "Zero conditional (general truth): if + present, present." },
  { id: "cond2", topicId: "conditionals", kind: "gapfill", prompt: "If it rains, I ___ stay home.", options: ["will", "would", "am", "have"], correctIndex: 0, explanation: "First conditional (real future): if + present, will + base." },
  { id: "cond3", topicId: "conditionals", kind: "gapfill", prompt: "If I ___ rich, I would travel.", options: ["were", "was", "am", "have been"], correctIndex: 0, explanation: "Second conditional: 'were' for all persons (hypothetical)." },
  { id: "cond4", topicId: "conditionals", kind: "gapfill", prompt: "If I had studied, I ___ have passed.", options: ["would", "will", "do", "am"], correctIndex: 0, explanation: "Third conditional: would have + past participle." },
  { id: "cond5", topicId: "conditionals", kind: "mcq", prompt: "Which is correct?", options: ["Unless you hurry, you'll miss the train.", "Unless you hurry, you'll recently miss the train.", "If you don't hurry, you would missed the train.", "If you hurry not, you will miss the train."], correctIndex: 0, explanation: "'Unless' = 'if not'." },
  { id: "cond6", topicId: "conditionals", kind: "mcq", prompt: "Which sentence is a mixed conditional?", options: ["If I had saved money, I would be rich now.", "If I save money, I will be rich.", "If I saved money, I was rich.", "If I had saved, I would have been rich."], correctIndex: 0, explanation: "Mixed: past condition + present result." },

  // ─────────────────────────── PASSIVE VOICE ───────────────────────────
  { id: "pass1", topicId: "passive-voice", kind: "gapfill", prompt: "English ___ spoken here.", options: ["is", "are", "were", "be"], correctIndex: 0, explanation: "Passive present: be + past participle → is spoken." },
  { id: "pass2", topicId: "passive-voice", kind: "gapfill", prompt: "The window was ___ by the storm.", options: ["broken", "broke", "breaking", "breaks"], correctIndex: 0, explanation: "Past passive: was + past participle." },
  { id: "pass3", topicId: "passive-voice", kind: "gapfill", prompt: "The report hasn't been ___.", options: ["finished", "finish", "finishing", "finishes"], correctIndex: 0, explanation: "Present perfect passive: has been + past participle." },
  { id: "pass4", topicId: "passive-voice", kind: "mcq", prompt: "Choose the correct passive.", options: ["This bridge was built in 1890.", "This bridge was build in 1890.", "This bridge built was 1890.", "This bridge was been built in 1890."], correctIndex: 0, explanation: "Passive: be + built (past participle)." },
  { id: "pass5", topicId: "passive-voice", kind: "mcq", prompt: "Which verb CANNOT be passive?", options: ["happen", "build", "write", "finish"], correctIndex: 0, explanation: "Intransitive verbs like 'happen' have no passive." },
  { id: "pass6", topicId: "passive-voice", kind: "gapfill", prompt: "Were the tickets ___?", options: ["sold", "sell", "selling", "sells"], correctIndex: 0, explanation: "Question passive: Were + the tickets + sold." },

  // ─────────────────────────── REPORTED SPEECH ───────────────────────────
  { id: "rs1", topicId: "reported-speech", kind: "mcq", prompt: "\"I'm tired.\" → He said he ___.", options: ["was tired", "is tired", "be tired", "am tired"], correctIndex: 0, explanation: "Backshift: present → past." },
  { id: "rs2", topicId: "reported-speech", kind: "mcq", prompt: "\"Where do you live?\" → She asked where I ___.", options: ["lived", "live", "am living", "will live"], correctIndex: 0, explanation: "Indirect questions have no inversion; backshift do → lived." },
  { id: "rs3", topicId: "reported-speech", kind: "mcq", prompt: "\"Don't touch it.\" → He warned me ___ it.", options: ["not to touch", "don't touch", "to not touch it now", "not touch"], correctIndex: 0, explanation: "Reported commands use tell/warn + (not) to-infinitive." },
  { id: "rs4", topicId: "reported-speech", kind: "mcq", prompt: "\"I will call you.\" → He said he ___ call me.", options: ["would", "will", "would have", "did"], correctIndex: 0, explanation: "Backshift: will → would." },
  { id: "rs5", topicId: "reported-speech", kind: "mcq", prompt: "\"Have you eaten?\" → She asked ___ I had eaten.", options: ["if", "that", "what", "why"], correctIndex: 0, explanation: "Yes/no questions are reported with if/whether." },
  { id: "rs6", topicId: "reported-speech", kind: "mcq", prompt: "Which sentence is correct?", options: ["He told me to sit down.", "He said me to sit down.", "He told me sit down it.", "He told I to sit down."], correctIndex: 0, explanation: "'Tell' needs an object (me); 'say' does not: say to me." },

  // ─────────────────────────── INVERSION & EMPHASIS ───────────────────────────
  { id: "inv1", topicId: "inversion-emphasis", kind: "gapfill", prompt: "Never ___ I seen such a mess.", options: ["have", "I have", "had I", "do"], correctIndex: 0, explanation: "After never, invert: Never have I seen…" },
  { id: "inv2", topicId: "inversion-emphasis", kind: "gapfill", prompt: "No sooner ___ we left than it rained.", options: ["had", "have", "did", "do"], correctIndex: 0, explanation: "Inversion after 'no sooner': No sooner had we left…" },
  { id: "inv3", topicId: "inversion-emphasis", kind: "mcq", prompt: "Which is the formal conditional inversion?", options: ["Had I known, I would have helped.", "If I would have known, I would have helped.", "If I had know, I would have helped.", "I had known, would have I helped."], correctIndex: 0, explanation: "Conditional inversion: Had + subject + past participle." },
  { id: "inv4", topicId: "inversion-emphasis", kind: "gapfill", prompt: "Only after the meeting ___ I understand.", options: ["did", "do", "have", "was"], correctIndex: 0, explanation: "After 'only after' invert with 'did'." },
  { id: "inv5", topicId: "inversion-emphasis", kind: "mcq", prompt: "Which is a correct cleft sentence?", options: ["It was John who broke it.", "It was John broke it.", "John was who broke it.", "It was broken by John who it."], correctIndex: 0, explanation: "Cleft: It + was + noun + who + verb." },
  { id: "inv6", topicId: "inversion-emphasis", kind: "gapfill", prompt: "Not only ___ she win, but she set a record.", options: ["did", "do", "does", "was"], correctIndex: 0, explanation: "'Not only' inverts the first clause: Not only did she win." },

  // ─────────────────────────── MODAL VERBS ───────────────────────────
  { id: "mod1", topicId: "modal-verbs", kind: "gapfill", prompt: "She ___ swim very well.", options: ["can", "cans", "can to", "is can"], correctIndex: 0, explanation: "Ability → can + base verb (no 'to', no -s)." },
  { id: "mod2", topicId: "modal-verbs", kind: "gapfill", prompt: "You ___ stop at the red light. (obligation)", options: ["must", "musts", "must to", "are must"], correctIndex: 0, explanation: "Obligation → must + base verb." },
  { id: "mod3", topicId: "modal-verbs", kind: "gapfill", prompt: "You ___ smoke here. (prohibition)", options: ["mustn't", "don't have to", "needn't to", "can't to"], correctIndex: 0, explanation: "Prohibition → mustn't." },
  { id: "mod4", topicId: "modal-verbs", kind: "gapfill", prompt: "He must ___ left his keys at home. (past deduction)", options: ["have", "had", "has", "to have"], correctIndex: 0, explanation: "Past deduction: modal + have + past participle." },
  { id: "mod5", topicId: "modal-verbs", kind: "mcq", prompt: "Choose the correct sentence.", options: ["May I come in?", "May I to come in?", "I may come in?", "May I coming in?"], correctIndex: 0, explanation: "Permission/request: May + subject + base verb." },
  { id: "mod6", topicId: "modal-verbs", kind: "mcq", prompt: "Which word is NOT a modal?", options: ["swim", "should", "may", "must"], correctIndex: 0, explanation: "'Swim' is an ordinary verb; should/may/must are all modals." },

  // ─────────────────────────── ARTICLES ───────────────────────────
  { id: "art1", topicId: "articles", kind: "gapfill", prompt: "I saw ___ dog in the park.", options: ["a", "an", "the", "no article"], correctIndex: 0, explanation: "First mention, non-specific → indefinite article 'a'." },
  { id: "art2", topicId: "articles", kind: "gapfill", prompt: "Can you close ___ door?", options: ["the", "a", "an", "no article"], correctIndex: 0, explanation: "Specific door (we both know which one) → 'the'." },
  { id: "art3", topicId: "articles", kind: "gapfill", prompt: "She is ___ engineer.", options: ["an", "a", "the", "no article"], correctIndex: 0, explanation: "Before vowel sound → 'an'." },
  { id: "art4", topicId: "articles", kind: "mcq", prompt: "Which is correct?", options: ["The sun is bright.", "A sun is bright.", "Sun is bright.", "An sun is bright."], correctIndex: 0, explanation: "Unique things (sun, moon) use 'the'." },
  { id: "art5", topicId: "articles", kind: "mcq", prompt: "Choose the correct sentence.", options: ["I like music.", "I like the music.", "I like a music.", "I like an music."], correctIndex: 0, explanation: "General/uncountable nouns (music) need no article." },
  { id: "art6", topicId: "articles", kind: "gapfill", prompt: "She is ___ best student in the class.", options: ["the", "a", "an", "no article"], correctIndex: 0, explanation: "Superlatives always use 'the'." },

  // ─────────────────── COUNTABLE / UNCOUNTABLE ───────────────────
  { id: "cu1", topicId: "countable-uncountable", kind: "gapfill", prompt: "How ___ students are in the class?", options: ["many", "much", "a lot", "some"], correctIndex: 0, explanation: "'Students' is countable → use 'many'." },
  { id: "cu2", topicId: "countable-uncountable", kind: "gapfill", prompt: "There isn't ___ milk left.", options: ["much", "many", "a few", "few"], correctIndex: 0, explanation: "'Milk' is uncountable → use 'much'." },
  { id: "cu3", topicId: "countable-uncountable", kind: "gapfill", prompt: "I have ___ friends in London.", options: ["a few", "a little", "much", "little"], correctIndex: 0, explanation: "'Friends' is countable → use 'a few'." },
  { id: "cu4", topicId: "countable-uncountable", kind: "mcq", prompt: "Which word is UNCOUNTABLE?", options: ["information", "books", "chairs", "students"], correctIndex: 0, explanation: "'Information' is uncountable — it has no plural." },
  { id: "cu5", topicId: "countable-uncountable", kind: "gapfill", prompt: "How ___ money do you need?", options: ["much", "many", "few", "a few"], correctIndex: 0, explanation: "'Money' is uncountable → use 'much'." },
  { id: "cu6", topicId: "countable-uncountable", kind: "mcq", prompt: "Choose the correct sentence.", options: ["She gave me some good advice.", "She gave me some good advices.", "She gave me a good advice.", "She gave me many advice."], correctIndex: 0, explanation: "'Advice' is uncountable → use 'some advice'." },

  // ─────────────── COMPARATIVES & SUPERLATIVES ───────────────
  { id: "cs1", topicId: "comparatives-superlatives", kind: "gapfill", prompt: "She is ___ than her brother.", options: ["taller", "more tall", "tallest", "most tall"], correctIndex: 0, explanation: "Short adjective (1 syllable): tall → taller." },
  { id: "cs2", topicId: "comparatives-superlatives", kind: "gapfill", prompt: "This book is ___ interesting than that one.", options: ["more", "most", "very", "much more"], correctIndex: 0, explanation: "Long adjective (3 syllables): use 'more + adj'." },
  { id: "cs3", topicId: "comparatives-superlatives", kind: "gapfill", prompt: "She is ___ student in the class.", options: ["the most intelligent", "the more intelligent", "most intelligent", "intelligentest"], correctIndex: 0, explanation: "Superlative with long adjective: the most + adj." },
  { id: "cs4", topicId: "comparatives-superlatives", kind: "mcq", prompt: "What is the superlative of 'good'?", options: ["best", "goodest", "most good", "better"], correctIndex: 0, explanation: "Irregular: good → better → best." },
  { id: "cs5", topicId: "comparatives-superlatives", kind: "gapfill", prompt: "This coffee is ___ than mine.", options: ["hotter", "more hot", "hottest", "more hotter"], correctIndex: 0, explanation: "Short adjective: hot → hotter." },
  { id: "cs6", topicId: "comparatives-superlatives", kind: "mcq", prompt: "Choose the correct sentence.", options: ["She is as tall as her mother.", "She is as tall than her mother.", "She is more tall as her mother.", "She is taller as her mother."], correctIndex: 0, explanation: "Equal comparison: as + adj + as." },

  // ─────────────── GERUNDS & INFINITIVES ───────────────
  { id: "gi1", topicId: "gerunds-infinitives", kind: "gapfill", prompt: "I enjoy ___ books.", options: ["reading", "to read", "read", "reads"], correctIndex: 0, explanation: "'Enjoy' is followed by the gerund (-ing)." },
  { id: "gi2", topicId: "gerunds-infinitives", kind: "gapfill", prompt: "She wants ___ become a doctor.", options: ["to", "ing", "for", "at"], correctIndex: 0, explanation: "'Want' is followed by the infinitive (to + verb)." },
  { id: "gi3", topicId: "gerunds-infinitives", kind: "gapfill", prompt: "He finished ___ the report.", options: ["writing", "to write", "write", "wrote"], correctIndex: 0, explanation: "'Finish' is followed by the gerund (-ing)." },
  { id: "gi4", topicId: "gerunds-infinitives", kind: "mcq", prompt: "Which is correct?", options: ["I stopped smoking.", "I stopped to smoke.", "Both are correct with different meanings."], correctIndex: 2, explanation: "'Stop + -ing' = quit. 'Stop + to-infinitive' = pause to do something." },
  { id: "gi5", topicId: "gerunds-infinitives", kind: "gapfill", prompt: "She's good ___ cooking Italian food.", options: ["at", "to", "for", "on"], correctIndex: 0, explanation: "After prepositions, always use the gerund: good at cooking." },
  { id: "gi6", topicId: "gerunds-infinitives", kind: "mcq", prompt: "Choose the correct sentence.", options: ["Remember to lock the door.", "Remember locking the door."], correctIndex: 0, explanation: "'Remember to + verb' = don't forget. 'Remember + -ing' = recall a past action." },

  // ─────────────── RELATIVE CLAUSES ───────────────
  { id: "rc1", topicId: "relative-clauses", kind: "gapfill", prompt: "The man ___ lives next door is a doctor.", options: ["who", "which", "where", "whose"], correctIndex: 0, explanation: "'Who' is used for people." },
  { id: "rc2", topicId: "relative-clauses", kind: "gapfill", prompt: "The book ___ I read was great.", options: ["which", "who", "where", "whose"], correctIndex: 0, explanation: "'Which' is used for things." },
  { id: "rc3", topicId: "relative-clauses", kind: "gapfill", prompt: "The restaurant ___ we ate was expensive.", options: ["where", "who", "which", "whose"], correctIndex: 0, explanation: "'Where' is used for places." },
  { id: "rc4", topicId: "relative-clauses", kind: "gapfill", prompt: "The girl ___ father is a teacher is in my class.", options: ["whose", "who", "which", "where"], correctIndex: 0, explanation: "'Whose' shows possession." },
  { id: "rc5", topicId: "relative-clauses", kind: "mcq", prompt: "Which can replace 'who' in informal English?", options: ["that", "which", "where", "whose"], correctIndex: 0, explanation: "'That' can replace 'who' for people in defining clauses." },
  { id: "rc6", topicId: "relative-clauses", kind: "mcq", prompt: "Choose the correct sentence.", options: ["The woman who called me is my aunt.", "The woman which called me is my aunt.", "The woman where called me is my aunt.", "The woman whose called me is my aunt."], correctIndex: 0, explanation: "'Who' is used for people." },
];

const BANK: Record<string, GrammarQuestion[]> = Object.create(null);
for (const q of Q) {
  (BANK[q.topicId] ??= []).push(q);
}

const MODE_COUNT: Record<GrammarMode, number> = { activity: 5, test: 10, assignment: 10 };

/** Deterministic question set for a topic and mode. */
export function buildQuiz(topicId: string, mode: GrammarMode): GrammarQuestion[] {
  const pool = BANK[topicId] ?? [];
  const count = MODE_COUNT[mode];
  return pool.slice(0, count);
}

export function getQuestions(topicId: string): GrammarQuestion[] {
  return BANK[topicId] ?? [];
}