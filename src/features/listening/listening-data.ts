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
  /** Optional real recording; when absent the app speaks the transcript with TTS. */
  audioUrl?: string;
  questions: ComprehensionQuestion[];
}

const exercises: ListeningExercise[] = [
  {
    id: "l-1",
    title: "A Morning in Manhattan",
    kind: "Story",
    accent: "American",
    minutes: 6,
    level: "B1",
    image: "/images/pic7.jpeg",
    transcript: `Sarah woke up early on a Tuesday morning in Manhattan. The sun was rising over the East River,
    casting golden light across the city streets. She grabbed her coffee from the corner café and walked
    through Central Park, enjoying the fresh air before work. The park was peaceful, with only a few joggers
    and dog walkers around. She loved these quiet moments before the city woke up completely.`,
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
        question: "Where did Sarah get her coffee?",
        options: ["Her home", "A corner café", "Central Park", "The office"],
        correctAnswer: 1,
        explanation: "Sarah 'grabbed her coffee from the corner café' before going to work.",
      },
      {
        id: "q1-3",
        question: "Which river was mentioned in the text?",
        options: ["Hudson River", "East River", "Harlem River", "Delaware River"],
        correctAnswer: 1,
        explanation: "The transcript mentions 'the sun was rising over the East River'.",
      },
      {
        id: "q1-4",
        question: "What did Sarah enjoy most about her morning walk?",
        options: ["Meeting friends", "The quiet moments before the city woke up", "Shopping", "Sightseeing"],
        correctAnswer: 1,
        explanation: "Sarah 'loved these quiet moments before the city woke up completely.'",
      },
    ],
  },
  {
    id: "l-2",
    title: "Tech News Weekly",
    kind: "News",
    accent: "British",
    minutes: 9,
    level: "B2",
    image: "/images/pic8.jpeg",
    transcript: `This week's tech headlines include several groundbreaking developments. Artificial intelligence continues
    to advance at an unprecedented pace, with new models demonstrating remarkable capabilities in natural language
    processing. Meanwhile, quantum computing research has achieved a significant milestone. Scientists have reported
    stable quantum states lasting longer than ever before. Additionally, cybersecurity experts are warning about
    emerging threats in cloud infrastructure. Companies are urged to implement stronger authentication protocols.`,
    questions: [
      {
        id: "q2-1",
        question: "What area has seen the most advancement this week according to the news?",
        options: ["Traditional computing", "Artificial intelligence", "Mobile devices", "Internet"],
        correctAnswer: 1,
        explanation: "The transcript states 'Artificial intelligence continues to advance at an unprecedented pace'.",
      },
      {
        id: "q2-2",
        question: "What milestone has quantum computing achieved?",
        options: ["New hardware", "Stable quantum states lasting longer than ever before", "Cost reduction", "Wider availability"],
        correctAnswer: 1,
        explanation: "The transcript mentions 'quantum computing research has achieved a significant milestone... stable quantum states lasting longer than ever before.'",
      },
      {
        id: "q2-3",
        question: "What are cybersecurity experts warning about?",
        options: ["Slow internet", "Emerging threats in cloud infrastructure", "Software updates", "Email spam"],
        correctAnswer: 1,
        explanation: "Cybersecurity experts are warning about 'emerging threats in cloud infrastructure'.",
      },
    ],
  },
  {
    id: "l-3",
    title: "Ordering at a Café",
    kind: "Conversation",
    accent: "Australian",
    minutes: 4,
    level: "A2",
    image: "/images/pic9.jpeg",
    transcript: `Customer: Hi! I'd like a cappuccino, please.
    Barista: Sure! What size would you like?
    Customer: Large, thanks. And could I get a croissant as well?
    Barista: Absolutely! That'll be $8.50. Here's your order.
    Customer: Great! Do you take card?
    Barista: Yes, we accept all major cards.`,
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
        question: "How much did the order cost?",
        options: ["$5.50", "$7.50", "$8.50", "$9.50"],
        correctAnswer: 2,
        explanation: "The barista says 'That'll be $8.50.'",
      },
    ],
  },
  {
    id: "l-4",
    title: "The Science of Habits",
    kind: "Podcast",
    accent: "American",
    minutes: 12,
    level: "B2",
    image: "/images/pic11.jpeg",
    transcript: `Welcome to the Science of Habits podcast. Today we're discussing how habits are formed and how
    to change them. Research shows that habits are created through repetition and reward. When you repeat an action
    and receive positive feedback, your brain creates neural pathways that make the behavior automatic. Breaking
    a habit is challenging because these pathways are deeply ingrained. However, studies show that replacing a
    habit with a new one is more effective than simply trying to eliminate it. The key is to identify the trigger
    and replace the response with a healthier alternative.`,
    questions: [
      {
        id: "q4-1",
        question: "What two factors are involved in habit formation according to the podcast?",
        options: ["Time and money", "Repetition and reward", "Genetics and environment", "Age and experience"],
        correctAnswer: 1,
        explanation: "The podcast states 'habits are created through repetition and reward.'",
      },
      {
        id: "q4-2",
        question: "Why is breaking a habit challenging?",
        options: ["It's too expensive", "Neural pathways are deeply ingrained", "Society doesn't support it", "There's no science behind it"],
        correctAnswer: 1,
        explanation: "The transcript explains 'Breaking a habit is challenging because these pathways are deeply ingrained.'",
      },
      {
        id: "q4-3",
        question: "What is more effective than simply trying to eliminate a habit?",
        options: ["Ignoring it", "Replacing it with a new habit", "Taking medication", "Professional help only"],
        correctAnswer: 1,
        explanation: "Studies show that 'replacing a habit with a new one is more effective than simply trying to eliminate it.'",
      },
    ],
  },
  {
    id: "l-5",
    title: "Winter in Vancouver",
    kind: "Story",
    accent: "Canadian",
    minutes: 7,
    level: "B1",
    image: "/images/pic14.jpeg",
    transcript: `Vancouver winters are mild compared to other Canadian cities. The city rarely experiences heavy snowfall,
    but gray skies and rain are common from November to March. Despite the weather, locals enjoy winter activities.
    Skiing is popular at nearby Whistler Mountain, which receives significant snowfall. Many residents stay indoors
    and visit museums, cafés, and indoor markets. The holiday season brings festive decorations throughout the city.
    Families gather for traditional celebrations and enjoy local cuisine.`,
    questions: [
      {
        id: "q5-1",
        question: "How are Vancouver winters compared to other Canadian cities?",
        options: ["Colder", "Mild", "Windier", "Snowy"],
        correctAnswer: 1,
        explanation: "The transcript states 'Vancouver winters are mild compared to other Canadian cities.'",
      },
      {
        id: "q5-2",
        question: "What type of weather is common in Vancouver from November to March?",
        options: ["Snow and ice", "Hot and dry", "Gray skies and rain", "Thunderstorms"],
        correctAnswer: 2,
        explanation: "The text mentions 'gray skies and rain are common from November to March.'",
      },
      {
        id: "q5-3",
        question: "Where is skiing popular near Vancouver?",
        options: ["Grouse Mountain", "Cypress Mountain", "Whistler Mountain", "Seymour Mountain"],
        correctAnswer: 2,
        explanation: "The transcript specifically mentions 'Skiing is popular at nearby Whistler Mountain.'",
      },
    ],
  },
  {
    id: "l-6",
    title: "Job Interview Practice",
    kind: "Conversation",
    accent: "British",
    minutes: 8,
    level: "B1",
    image: "/images/pi10.jpeg",
    transcript: `Interviewer: Tell me about your experience in project management.
    Candidate: I've managed several projects ranging from three to eighteen months in duration.
    Interviewer: What was your biggest challenge?
    Candidate: Time management was difficult when juggling multiple projects simultaneously.
    Interviewer: How did you overcome it?
    Candidate: I implemented a scheduling system and delegated tasks more effectively.
    Interviewer: That sounds great. Do you have any questions for me?
    Candidate: Yes, what does success look like in the first 90 days?`,
    questions: [
      {
        id: "q6-1",
        question: "What is the candidate's area of experience?",
        options: ["Sales", "Project management", "Customer service", "Finance"],
        correctAnswer: 1,
        explanation: "The interviewer asks 'Tell me about your experience in project management.'",
      },
      {
        id: "q6-2",
        question: "What was the candidate's biggest challenge?",
        options: ["Communication", "Time management", "Leadership", "Technical skills"],
        correctAnswer: 1,
        explanation: "The candidate states 'Time management was difficult when juggling multiple projects simultaneously.'",
      },
      {
        id: "q6-3",
        question: "How did the candidate overcome the challenge?",
        options: ["Hired more staff", "Reduced projects", "Implemented a scheduling system and delegated tasks", "Changed jobs"],
        correctAnswer: 2,
        explanation: "The candidate explains 'I implemented a scheduling system and delegated tasks more effectively.'",
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
