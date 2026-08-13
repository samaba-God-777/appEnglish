import type { CefrLevel } from "@/types";

export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ListeningExercise {
  id: string;
  title: string;
  kind: "Podcast" | "News" | "Story" | "Conversation";
  accent: "American" | "British" | "Australian" | "Canadian";
  minutes: number;
  level: CefrLevel;
  image: string;
  transcript: string;
  audioUrl?: string;
  questions: ComprehensionQuestion[];
}

const exercises: ListeningExercise[] = [
  // ─────────────────────────────────────────────────────────────────────
  // L-1  A Morning in Manhattan  (B1 · American)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "l-1",
    title: "A Morning in Manhattan",
    kind: "Story",
    accent: "American",
    minutes: 6,
    level: "B1",
    image: "/images/pic7.jpeg",
    transcript: `Sarah woke up early on a Tuesday morning in Manhattan. The alarm clock read 6:15 a.m., and
    golden sunlight was already streaming through the blinds of her apartment on West 72nd Street. She stretched,
    threw on her favorite running shoes, and headed downstairs.

    The corner café on Columbus Avenue was already open. Sarah ordered her usual — a medium oat-milk latte — and
    stepped outside. The air was crisp, carrying the faint smell of roasted nuts from the cart on the corner. She
    waved at Mr. Kim, who was setting up his flower stand across the street, and began her walk through Central Park.

    The park was peaceful at this hour. A few joggers passed her along the reservoir path, and an elderly man was
    feeding pigeons near the Bethesda Fountain. Sarah loved these quiet moments before the city woke up completely.
    She took a deep breath, listened to the birds, and smiled.

    After her walk, she stopped at the office on Fifth Avenue. Her colleague, David, was already at his desk,
    reviewing emails. "Good morning, Sarah! Did you catch the game last night?" he asked. Sarah laughed. "I fell
    asleep in the third quarter," she admitted. "But I heard it was a close one."

    By nine o'clock, the office was buzzing with activity. Sarah opened her laptop, sipped her coffee, and
    prepared for her ten o'clock meeting. She glanced out the window at the Manhattan skyline and felt grateful
    for every morning like this one.`,
    questions: [
      {
        id: "q1-1",
        question: "What day of the week did Sarah wake up?",
        options: ["Monday", "Tuesday", "Wednesday", "Sunday"],
        correctAnswer: 1,
        explanation: "The transcript clearly states 'Sarah woke up early on a Tuesday morning in Manhattan.'",
      },
      {
        id: "q1-2",
        question: "What time did Sarah's alarm go off?",
        options: ["5:45 a.m.", "6:00 a.m.", "6:15 a.m.", "6:30 a.m."],
        correctAnswer: 2,
        explanation: "The text says 'The alarm clock read 6:15 a.m.'",
      },
      {
        id: "q1-3",
        question: "Where did Sarah get her coffee?",
        options: ["Her home", "A corner café on Columbus Avenue", "Central Park", "The office"],
        correctAnswer: 1,
        explanation: "Sarah went to 'The corner café on Columbus Avenue' and ordered a medium oat-milk latte.",
      },
      {
        id: "q1-4",
        question: "What street does Sarah live on?",
        options: ["Fifth Avenue", "Broadway", "West 72nd Street", "Madison Avenue"],
        correctAnswer: 2,
        explanation: "The text mentions 'her apartment on West 72nd Street.'",
      },
      {
        id: "q1-5",
        question: "Who is Mr. Kim?",
        options: ["Sarah's boss", "Her neighbor", "A flower stand owner on the corner", "A jogger in the park"],
        correctAnswer: 2,
        explanation: "Sarah 'waved at Mr. Kim, who was setting up his flower stand across the street.'",
      },
      {
        id: "q1-6",
        question: "What did the elderly man do near the Bethesda Fountain?",
        options: ["Jogging", "Reading a newspaper", "Feeding pigeons", "Playing guitar"],
        correctAnswer: 2,
        explanation: "The text says 'an elderly man was feeding pigeons near the Bethesda Fountain.'",
      },
      {
        id: "q1-7",
        question: "What did Sarah's colleague David ask her about?",
        options: ["The weather", "The game last night", "Her weekend plans", "A project at work"],
        correctAnswer: 1,
        explanation: "David asked 'Did you catch the game last night?'",
      },
      {
        id: "q1-8",
        question: "Why did Sarah miss the end of the game?",
        options: ["She was working late", "She went to the park", "She fell asleep in the third quarter", "She was at a meeting"],
        correctAnswer: 2,
        explanation: "Sarah admitted 'I fell asleep in the third quarter.'",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // L-2  Tech News Weekly  (B2 · British)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "l-2",
    title: "Tech News Weekly",
    kind: "News",
    accent: "British",
    minutes: 9,
    level: "B2",
    image: "/images/pic8.jpeg",
    transcript: `This is Tech News Weekly, reporting from London. I'm your host, James Whitfield, and here are
    the stories shaping the technology landscape this week.

    Leading the headlines: artificial intelligence continues to advance at an unprecedented pace. A San Francisco–based
    startup called NeuralEdge has unveiled a new language model capable of real-time translation across more than
    forty languages with near-perfect accuracy. The company claims the model can also generate code, write
    creative fiction, and even tutor students in advanced mathematics. Industry analysts predict this could
    disrupt the education sector within five years.

    In other news, quantum computing researchers at the University of Oxford have achieved a significant milestone.
    Their team has demonstrated stable quantum states lasting over three hundred milliseconds — a record that
    could accelerate the development of practical quantum processors. Professor Elena Marchetti, who led the
    study, told reporters that this breakthrough brings us closer to solving problems that classical computers
    simply cannot handle, such as molecular simulation for drug discovery.

    Meanwhile, cybersecurity experts are urging companies to strengthen their cloud security protocols. A recent
    report from the European Cybersecurity Agency found a forty percent increase in sophisticated phishing attacks
    targeting multinational corporations. The report recommends implementing multi-factor authentication, regular
    penetration testing, and employee awareness programmes. "The threat landscape is evolving faster than most
    organisations can keep up with," said cybersecurity analyst Raj Patel.

    Finally, a quick look at the market: shares in major tech companies rose this week following better-than-expected
    quarterly earnings. Apple, Microsoft, and Alphabet all reported strong revenue growth, driven largely by
    cloud services and AI integration.`,
    questions: [
      {
        id: "q2-1",
        question: "What area has seen the most advancement this week according to the news?",
        options: ["Traditional computing", "Artificial intelligence", "Mobile devices", "Internet infrastructure"],
        correctAnswer: 1,
        explanation: "The transcript states 'artificial intelligence continues to advance at an unprecedented pace.'",
      },
      {
        id: "q2-2",
        question: "What is the name of the startup that unveiled a new language model?",
        options: ["DeepMind", "NeuralEdge", "OpenAI", "Quantum Labs"],
        correctAnswer: 1,
        explanation: "The text mentions 'A San Francisco–based startup called NeuralEdge.'",
      },
      {
        id: "q2-3",
        question: "How many languages can NeuralEdge's model translate in real time?",
        options: ["Twenty", "Thirty", "More than forty", "Over one hundred"],
        correctAnswer: 2,
        explanation: "The model is 'capable of real-time translation across more than forty languages.'",
      },
      {
        id: "q2-4",
        question: "What milestone did the University of Oxford achieve in quantum computing?",
        options: ["Built a quantum computer", "Stable quantum states lasting over 300 milliseconds", "Sold quantum technology to a company", "Reduced quantum computing costs"],
        correctAnswer: 1,
        explanation: "The team 'demonstrated stable quantum states lasting over three hundred milliseconds.'",
      },
      {
        id: "q2-5",
        question: "What did Professor Marchetti say quantum computing could help with?",
        options: ["Faster internet", "Molecular simulation for drug discovery", "Social media algorithms", "Weather forecasting"],
        correctAnswer: 1,
        explanation: "She said it could help with 'molecular simulation for drug discovery.'",
      },
      {
        id: "q2-6",
        question: "How much did phishing attacks increase according to the European Cybersecurity Agency?",
        options: ["Twenty percent", "Thirty percent", "Forty percent", "Fifty percent"],
        correctAnswer: 2,
        explanation: "The report found 'a forty percent increase in sophisticated phishing attacks.'",
      },
      {
        id: "q2-7",
        question: "Which companies reported strong quarterly earnings?",
        options: ["Tesla, Amazon, Meta", "Apple, Microsoft, Alphabet", "Samsung, Sony, Huawei", "IBM, Oracle, SAP"],
        correctAnswer: 1,
        explanation: "The text states 'Apple, Microsoft, and Alphabet all reported strong revenue growth.'",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // L-3  Ordering at a Café  (A2 · Australian)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "l-3",
    title: "Ordering at a Café",
    kind: "Conversation",
    accent: "Australian",
    minutes: 4,
    level: "A2",
    image: "/images/pic9.jpeg",
    transcript: `Barista: Good morning! Welcome to Bean & Brew. What can I get for you today?

    Customer: Hi! I'd like a cappuccino, please.

    Barista: Sure thing! What size would you like — small, medium, or large?

    Customer: Large, thanks. And could I get a croissant as well?

    Barista: Absolutely! Do you want it heated up?

    Customer: Yes, please. Warm would be great.

    Barista: No worries. So that's a large cappuccino and a warm croissant. Anything else?

    Customer: Hmm, actually, do you have any muffins today?

    Barista: We do! Blueberry and banana walnut.

    Customer: I'll take a blueberry muffin too, thanks.

    Barista: Perfect. That'll be $12.50. Would you like to pay by card or cash?

    Customer: Card, please.

    Barista: Here's your receipt. Your order will be ready in just a moment. Have a wonderful day!

    Customer: Thanks, you too!`,
    questions: [
      {
        id: "q3-1",
        question: "What size cappuccino did the customer order?",
        options: ["Small", "Medium", "Large", "Extra large"],
        correctAnswer: 2,
        explanation: "The customer says 'Large, thanks' when asked about the size.",
      },
      {
        id: "q3-2",
        question: "What food item did the customer also order?",
        options: ["Muffin", "Cookie", "Croissant", "Sandwich"],
        correctAnswer: 2,
        explanation: "The customer asks 'Could I get a croissant as well?'",
      },
      {
        id: "q3-3",
        question: "How did the customer want the croissant?",
        options: ["Cold", "With butter", "Heated up / warm", "With jam"],
        correctAnswer: 2,
        explanation: "When asked if they want it heated, the customer says 'Yes, please. Warm would be great.'",
      },
      {
        id: "q3-4",
        question: "What muffin flavours were available?",
        options: ["Chocolate and vanilla", "Blueberry and banana walnut", "Strawberry and raspberry", "Apple and cinnamon"],
        correctAnswer: 1,
        explanation: "The barista says 'We do! Blueberry and banana walnut.'",
      },
      {
        id: "q3-5",
        question: "How much did the total order cost?",
        options: ["$8.50", "$10.50", "$12.50", "$15.00"],
        correctAnswer: 2,
        explanation: "The barista says 'That'll be $12.50.'",
      },
      {
        id: "q3-6",
        question: "How did the customer pay?",
        options: ["Cash", "Card", "Mobile payment", "Gift card"],
        correctAnswer: 1,
        explanation: "The customer says 'Card, please.'",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // L-4  The Science of Habits  (B2 · American)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "l-4",
    title: "The Science of Habits",
    kind: "Podcast",
    accent: "American",
    minutes: 12,
    level: "B2",
    image: "/images/pic11.jpeg",
    transcript: `Welcome to the Science of Habits podcast. I'm Dr. Laura Chen, and today we're discussing how
    habits are formed, why they're so hard to break, and what the latest research tells us about changing them.

    Let's start with the basics. A habit is a behaviour that you perform regularly, often without thinking about it.
    Researchers at University College London found that, on average, it takes sixty-six days for a new behaviour to
    become automatic. That's much longer than the popular "twenty-one days" myth. The exact time varies depending on
    the complexity of the behaviour — brushing your teeth might become a habit in less than three weeks, while
    going to the gym could take over two months.

    So how are habits actually formed? It all starts with something called the habit loop. Every habit has three
    components: a cue, a routine, and a reward. The cue is the trigger that tells your brain to go into automatic
    mode. It could be a time of day, an emotion, a location, or the presence of certain people. The routine is
    the behaviour itself — the action you take. And the reward is the positive feeling you get from completing the
    routine, which reinforces the habit and makes you more likely to repeat it.

    Neuroscientists have discovered that habits are stored in a part of the brain called the basal ganglia, which
    is also involved in emotions and memory. When a habit is formed, the brain stops fully participating in the
    decision-making process. Instead, it goes on autopilot. This is why you might find yourself driving home from
    work and not remembering part of the journey — your brain was running on habit.

    Breaking a habit is challenging because these neural pathways are deeply ingrained. But here's the good news:
    research shows that replacing a habit with a new one is far more effective than simply trying to eliminate it.
    The key is to identify the cue and the reward, then find a healthier routine that provides a similar reward.
    For example, if you snack out of boredom, try going for a short walk instead. The boredom is the cue, the walk
    is the new routine, and the mental break is the reward.

    Finally, environment plays a huge role. People who want to eat healthier should remove junk food from their
    kitchens. Those who want to exercise in the morning should lay out their gym clothes the night before. Making
    good habits easy and bad habits difficult is one of the most powerful strategies for lasting change.`,
    questions: [
      {
        id: "q4-1",
        question: "How long does it take for a new behaviour to become automatic according to UCL research?",
        options: ["21 days", "30 days", "66 days", "90 days"],
        correctAnswer: 2,
        explanation: "The transcript states 'it takes sixty-six days for a new behaviour to become automatic.'",
      },
      {
        id: "q4-2",
        question: "What are the three components of the habit loop?",
        options: ["Trigger, action, result", "Cue, routine, reward", "Cause, process, outcome", "Stimulus, response, reinforcement"],
        correctAnswer: 1,
        explanation: "The podcast explains 'Every habit has three components: a cue, a routine, and a reward.'",
      },
      {
        id: "q4-3",
        question: "Where in the brain are habits stored?",
        options: ["Cerebellum", "Hippocampus", "Basal ganglia", "Frontal lobe"],
        correctAnswer: 2,
        explanation: "The transcript says 'habits are stored in a part of the brain called the basal ganglia.'",
      },
      {
        id: "q4-4",
        question: "Why is breaking a habit challenging?",
        options: ["It costs money", "Neural pathways are deeply ingrained", "Other people won't let you", "There's no science behind it"],
        correctAnswer: 1,
        explanation: "The text explains 'Breaking a habit is challenging because these neural pathways are deeply ingrained.'",
      },
      {
        id: "q4-5",
        question: "What is more effective than simply trying to eliminate a habit?",
        options: ["Ignoring it completely", "Replacing it with a new habit", "Taking medication", "Waiting for it to go away"],
        correctAnswer: 1,
        explanation: "Research shows that 'replacing a habit with a new one is far more effective than simply trying to eliminate it.'",
      },
      {
        id: "q4-6",
        question: "If you snack out of boredom, what healthier alternative does the podcast suggest?",
        options: ["Drink water", "Read a book", "Go for a short walk", "Call a friend"],
        correctAnswer: 2,
        explanation: "The podcast suggests 'If you snack out of boredom, try going for a short walk instead.'",
      },
      {
        id: "q4-7",
        question: "What should people who want to eat healthier do at home?",
        options: ["Buy bigger plates", "Remove junk food from their kitchens", "Cook more often", "Eat slower"],
        correctAnswer: 1,
        explanation: "The text advises 'People who want to eat healthier should remove junk food from their kitchens.'",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // L-5  Winter in Vancouver  (B1 · Canadian)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "l-5",
    title: "Winter in Vancouver",
    kind: "Story",
    accent: "Canadian",
    minutes: 7,
    level: "B1",
    image: "/images/pic14.jpeg",
    transcript: `Vancouver winters are mild compared to other Canadian cities. While Toronto and Montreal deal with
    heavy snowfall and freezing temperatures, Vancouver rarely sees more than a few centimetres of snow all season.
    Instead, residents face months of gray skies and steady rain from November through March.

    Despite the gloomy weather, locals have learned to enjoy the season. Many head to Whistler Mountain, about a
    ninety-minute drive north of the city, for world-class skiing and snowboarding. The resort consistently ranks
    among the top winter destinations in North America, attracting visitors from around the globe.

    For those who prefer to stay in the city, Vancouver offers plenty of indoor activities. The Museum of
    Anthropology at the University of British Columbia showcases stunning Indigenous art and artefacts. Granville
    Island's Public Market is a favourite spot for foodies, with vendors selling fresh seafood, artisan cheeses,
    and warm pastries — perfect for a rainy afternoon.

    The holiday season brings festive decorations to Robson Street and Gastown. Families gather at Canada Place
    to watch the lighting ceremony, and many restaurants offer special holiday menus featuring local cuisine such
    as Pacific salmon and Dungeness crab.

    As January turns to February, Vancouverites start planning for spring. Cherry blossom festivals are announced,
    and the city begins its transformation into one of Canada's most beautiful spring destinations. But for now,
    locals sip their lattes, browse bookshops, and wait patiently for the rain to stop.`,
    questions: [
      {
        id: "q5-1",
        question: "How are Vancouver winters compared to other Canadian cities?",
        options: ["Colder", "Mild", "Windier", "Snowier"],
        correctAnswer: 1,
        explanation: "The transcript states 'Vancouver winters are mild compared to other Canadian cities.'",
      },
      {
        id: "q5-2",
        question: "What type of weather is common in Vancouver from November to March?",
        options: ["Snow and ice", "Hot and dry", "Gray skies and rain", "Thunderstorms"],
        correctAnswer: 2,
        explanation: "The text mentions 'gray skies and steady rain from November through March.'",
      },
      {
        id: "q5-3",
        question: "How far is Whistler Mountain from Vancouver?",
        options: ["A 30-minute drive", "A 60-minute drive", "A 90-minute drive", "A 3-hour drive"],
        correctAnswer: 2,
        explanation: "The transcript says Whistler is 'about a ninety-minute drive north of the city.'",
      },
      {
        id: "q5-4",
        question: "What does the Museum of Anthropology showcase?",
        options: ["Modern art", "Science exhibits", "Indigenous art and artefacts", "Space exploration"],
        correctAnswer: 2,
        explanation: "The museum 'showcases stunning Indigenous art and artefacts.'",
      },
      {
        id: "q5-5",
        question: "Where is the Public Market located?",
        options: ["Stanley Park", "Granville Island", "Robson Street", "Gastown"],
        correctAnswer: 1,
        explanation: "The text mentions 'Granville Island's Public Market.'",
      },
      {
        id: "q5-6",
        question: "What local foods are mentioned in the holiday menus?",
        options: ["Maple syrup and poutine", "Pacific salmon and Dungeness crab", "Beaver tails and smoked meat", "Tourtière and butter tarts"],
        correctAnswer: 1,
        explanation: "The transcript lists 'Pacific salmon and Dungeness crab.'",
      },
      {
        id: "q5-7",
        question: "What do Vancouverites look forward to in spring?",
        options: ["Summer festivals", "Cherry blossom festivals", "Skiing season", "Harvest markets"],
        correctAnswer: 1,
        explanation: "The text says 'Cherry blossom festivals are announced.'",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  // L-6  Job Interview Practice  (B1 · British)
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "l-6",
    title: "Job Interview Practice",
    kind: "Conversation",
    accent: "British",
    minutes: 8,
    level: "B1",
    image: "/images/pi10.jpeg",
    transcript: `Interviewer: Good morning. Please, have a seat. Can I get you some water before we start?

    Candidate: Thank you, I'm fine. Good morning, it's lovely to meet you.

    Interviewer: Likewise. So, let's begin. Tell me about your experience in project management.

    Candidate: I've been working in project management for about six years now. I've managed several projects
    ranging from small three-month initiatives to large-scale implementations lasting eighteen months. Most of my
    experience has been in the technology sector, working with cross-functional teams across different time zones.

    Interviewer: Impressive. What would you say was your biggest challenge in those roles?

    Candidate: Time management was definitely the most difficult aspect. When you're juggling multiple projects
    simultaneously, each with their own deadlines and stakeholder expectations, it can feel overwhelming. There was
    one period where I was managing three projects at once, and I realised I wasn't giving any of them the attention
    they deserved.

    Interviewer: That's a common struggle. How did you overcome it?

    Candidate: I implemented a structured scheduling system where I blocked specific time slots for each project
    every day. I also started delegating tasks more effectively, trusting my team members to take ownership of
    smaller deliverables. That freed me up to focus on the strategic decisions that really needed my attention.

    Interviewer: That's a very thoughtful approach. Can you give me an example of a project you're particularly
    proud of?

    Candidate: Certainly. Last year, I led a team of twelve to redesign our company's customer onboarding process.
    We reduced the average onboarding time from three weeks to just five days, which increased customer satisfaction
    scores by twenty-two percent.

    Interviewer: Excellent results. Do you have any questions for us?

    Candidate: Yes, actually. What does success look like in the first ninety days of this role? And how would you
    describe the team I'd be working with?

    Interviewer: Those are great questions. Let me tell you about the team...`,
    questions: [
      {
        id: "q6-1",
        question: "How many years has the candidate worked in project management?",
        options: ["Three years", "Four years", "Six years", "Ten years"],
        correctAnswer: 2,
        explanation: "The candidate says 'I've been working in project management for about six years now.'",
      },
      {
        id: "q6-2",
        question: "What is the candidate's area of experience?",
        options: ["Sales", "Project management", "Customer service", "Finance"],
        correctAnswer: 1,
        explanation: "The interviewer asks 'Tell me about your experience in project management.'",
      },
      {
        id: "q6-3",
        question: "What was the candidate's biggest challenge?",
        options: ["Communication", "Time management", "Leadership", "Technical skills"],
        correctAnswer: 1,
        explanation: "The candidate states 'Time management was definitely the most difficult aspect.'",
      },
      {
        id: "q6-4",
        question: "How many projects was the candidate managing at the most difficult time?",
        options: ["One", "Two", "Three", "Five"],
        correctAnswer: 2,
        explanation: "The candidate mentions 'managing three projects at once.'",
      },
      {
        id: "q6-5",
        question: "What two strategies did the candidate use to improve time management?",
        options: ["Hiring more staff and working overtime", "A scheduling system and delegating tasks", "Reducing projects and taking holidays", "Using new software and skipping meetings"],
        correctAnswer: 1,
        explanation: "The candidate implemented 'a structured scheduling system' and 'started delegating tasks more effectively.'",
      },
      {
        id: "q6-6",
        question: "How much did the candidate reduce customer onboarding time?",
        options: ["From two weeks to two days", "From three weeks to five days", "From one month to one week", "From four weeks to ten days"],
        correctAnswer: 1,
        explanation: "The candidate says 'We reduced the average onboarding time from three weeks to just five days.'",
      },
      {
        id: "q6-7",
        question: "By how much did customer satisfaction scores increase?",
        options: ["Twelve percent", "Fifteen percent", "Twenty-two percent", "Thirty percent"],
        correctAnswer: 2,
        explanation: "The candidate states 'customer satisfaction scores increased by twenty-two percent.'",
      },
      {
        id: "q6-8",
        question: "What questions did the candidate ask at the end?",
        options: ["About salary and benefits", "About success in the first 90 days and the team", "About company history and locations", "About holidays and work hours"],
        correctAnswer: 1,
        explanation: "The candidate asked 'What does success look like in the first ninety days' and 'how would you describe the team.'",
      },
    ],
  },
];

export function getListeningExercise(id: string): ListeningExercise | null {
  return exercises.find((ex) => ex.id === id) ?? null;
}

export function getAllListeningExercises(): ListeningExercise[] {
  return exercises;
}
