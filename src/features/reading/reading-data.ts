import type { CefrLevel } from "@/types";

export interface ReadingArticle {
  id: string;
  level: CefrLevel;
  type: "Article" | "Story" | "News" | "Dialogue";
  title: string;
  preview: string;
  fullText: string;
  wordCount: number;
  estimatedMinutes: number;
  author?: string;
  vocabulary: { word: string; definition: string }[];
  comprehensionQuestions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

const articles: ReadingArticle[] = [
  {
    id: "r-b2-1",
    level: "B2",
    type: "Article",
    title: "The City That Never Sleeps — and Why It Should",
    preview: "Scientists studying urban life have found that constant noise and light change how our brains rest...",
    fullText: `The City That Never Sleeps — and Why It Should

Sleep is one of the most fundamental aspects of human health, yet millions of people living in modern cities are chronically sleep-deprived. Scientists studying urban life have discovered that constant noise and light change how our brains rest, leading to serious health consequences.

Dr. Sarah Chen, a neuroscientist at the Urban Health Institute, has spent the last decade researching how city environments affect sleep patterns. "What we've found is truly alarming," Chen explains. "People living in noisy urban areas experience fragmented sleep cycles. Even when they sleep for eight hours, the quality of that sleep is significantly compromised."

The consequences extend far beyond simple tiredness. Chronic sleep deprivation has been linked to increased risk of heart disease, diabetes, obesity, and even cognitive decline. A recent study published in the Journal of Urban Medicine found that residents of cities with high noise pollution had a 30% higher risk of developing hypertension compared to those in quieter areas.

The solution, however, is more complex than simply moving to the countryside. Urban planners and architects are now designing "sleep-friendly" cities with noise barriers, green spaces, and strategic lighting that mimics natural circadian rhythms. Some innovative cities have even implemented "quiet hours" policies and invested in acoustic engineering for buildings.

"It's not about eliminating the city," Chen notes. "It's about redesigning it with human biology in mind. Our bodies evolved over millions of years to sync with the natural light-dark cycle. Modern city life disrupts this fundamental rhythm, and we're only beginning to understand the full impact."

As urbanization continues to accelerate globally, the question becomes increasingly urgent: Can we build cities where people can truly rest?`,
    wordCount: 950,
    estimatedMinutes: 8,
    author: "Dr. Sarah Chen",
    vocabulary: [
      { word: "chronically", definition: "continuing over a long period of time; constantly" },
      { word: "fragmented", definition: "broken into separate pieces; not continuous" },
      { word: "deprivation", definition: "the state of being without something essential" },
      { word: "hypertension", definition: "abnormally high blood pressure" },
      { word: "circadian rhythms", definition: "biological processes that occur in roughly 24-hour cycles" },
      { word: "disrupts", definition: "to interrupt or disturb" },
    ],
    comprehensionQuestions: [
      {
        id: "q1",
        question: "What is the main health consequence of chronic sleep deprivation mentioned in the article?",
        options: [
          "Increased stress levels only",
          "Higher risk of heart disease, diabetes, obesity, and cognitive decline",
          "Temporary mood changes",
          "Improved memory function",
        ],
        correctAnswer: 1,
        explanation: "The article clearly states that chronic sleep deprivation has been linked to increased risk of heart disease, diabetes, obesity, and even cognitive decline.",
      },
      {
        id: "q2",
        question: "According to the study, what percentage higher risk do residents of noisy cities have for hypertension?",
        options: ["10%", "20%", "30%", "50%"],
        correctAnswer: 2,
        explanation: "The article mentions that residents of cities with high noise pollution had a 30% higher risk of developing hypertension.",
      },
      {
        id: "q3",
        question: "What approach are urban planners taking to address sleep issues in cities?",
        options: [
          "Banning all night-time activities",
          "Designing sleep-friendly cities with noise barriers, green spaces, and strategic lighting",
          "Requiring everyone to work night shifts",
          "Removing all artificial light sources",
        ],
        correctAnswer: 1,
        explanation: "The article explains that urban planners are designing 'sleep-friendly' cities with noise barriers, green spaces, and strategic lighting that mimics natural circadian rhythms.",
      },
    ],
  },
  {
    id: "r-b1-1",
    level: "B1",
    type: "Story",
    title: "The Lighthouse Keeper's Daughter",
    preview: "Every evening, Mara climbed the ninety-nine steps to light the lamp her father could no longer reach...",
    fullText: `The Lighthouse Keeper's Daughter

Every evening, Mara climbed the ninety-nine steps of the lighthouse to light the lamp. Her father, Thomas, had kept the light burning for forty years, but age had made the climb impossible. Now it was Mara's responsibility.

The lighthouse stood on a rocky peninsula, surrounded by churning waves. It was isolated work, and many young people had abandoned it for opportunities in the city. But Mara loved the lighthouse. She loved the rhythm of the waves, the cry of the seagulls, and the quiet hours spent reading in the keeper's cottage.

One stormy night, a ship appeared through the fog. Mara watched anxiously as it approached the rocks. The ship's captain had clearly not seen the lighthouse beam. With trembling hands, Mara checked the lamp—it was burning brightly. She grabbed the signal lamp and climbed to the gallery, flashing urgent warnings into the darkness.

For endless minutes, she watched as the ship changed course. It didn't crash. The beam of her lighthouse had saved lives.

Years later, when Mara finally retired from the lighthouse, she received a letter from the captain whose ship she had saved. "You were the light that guided us home," he wrote. "Not just for one night, but for every sailor who saw your beacon and knew they were safe."

Mara understood then that the lighthouse was never just a building. It was hope, duty, and the connection between a lonely shore and the vast sea beyond.`,
    wordCount: 1400,
    estimatedMinutes: 12,
    author: "Traditional Tale",
    vocabulary: [
      { word: "keeper", definition: "a person who looks after or maintains something" },
      { word: "peninsula", definition: "a piece of land surrounded by water on three sides" },
      { word: "churning", definition: "moving violently and turbulently" },
      { word: "abandoned", definition: "left behind or given up completely" },
      { word: "beacon", definition: "a light or signal that guides people" },
    ],
    comprehensionQuestions: [
      {
        id: "q1",
        question: "Why did Mara climb the lighthouse steps every evening?",
        options: [
          "For exercise",
          "To light the lamp because her father was too old to do it",
          "To watch the sunset",
          "To clean the lighthouse",
        ],
        correctAnswer: 1,
        explanation: "The story explains that Mara's father, Thomas, had kept the light for forty years, but age made the climb impossible, so it became Mara's responsibility.",
      },
      {
        id: "q2",
        question: "What did Mara do when she saw the ship approaching the rocks?",
        options: [
          "Called for help on the radio",
          "Checked the lamp and flashed urgent warnings with the signal lamp",
          "Went to warn the shore",
          "Turned off the lighthouse light",
        ],
        correctAnswer: 1,
        explanation: "The story states that Mara checked the lamp, grabbed the signal lamp, climbed to the gallery, and flashed urgent warnings into the darkness.",
      },
    ],
  },
  {
    id: "r-b1-2",
    level: "B1",
    type: "News",
    title: "Why Remote Work Is Here to Stay",
    preview: "Five years after the great shift, companies report that flexible schedules improved both output and morale...",
    fullText: `Why Remote Work Is Here to Stay

Five years after the global shift to remote work, companies are reporting unexpected benefits that go far beyond simple convenience. The data shows that flexible work arrangements are here to stay, fundamentally changing how we think about productivity and workplace culture.

"Initially, we worried about maintaining productivity," says Jennifer Martinez, CEO of a tech company with over 5,000 employees. "But what we discovered surprised us. Productivity actually increased by 18%, and employee satisfaction scores went up significantly."

The reasons are multifaceted. Remote workers report fewer distractions and more control over their work environment. They save time commuting, which they can dedicate to their actual work or personal well-being. Perhaps most importantly, companies have access to a global talent pool, no longer limited by geography.

However, challenges remain. Mental health concerns about isolation are real, and company culture requires intentional effort to maintain. Some industries still require in-person presence, and certain job roles benefit from immediate collaboration.

The future appears to be hybrid: most companies are implementing flexible models where employees work partially from home and partially from offices. This approach captures the benefits of remote work while maintaining the connection and collaboration that offices provide.

"The pandemic forced us to rethink everything," Martinez reflects. "What we learned is that people can be productive anywhere, given the right tools and trust from management."`,
    wordCount: 770,
    estimatedMinutes: 6,
    vocabulary: [
      { word: "multifaceted", definition: "having many different aspects or features" },
      { word: "distractions", definition: "things that take attention away from what you're doing" },
      { word: "intentional", definition: "done deliberately and carefully" },
      { word: "hybrid", definition: "a combination of two different things" },
    ],
    comprehensionQuestions: [
      {
        id: "q1",
        question: "What was the unexpected finding about remote work's impact on productivity?",
        options: [
          "It decreased by 18%",
          "It remained the same",
          "It increased by 18%",
          "It varied by industry",
        ],
        correctAnswer: 2,
        explanation: "The article states that productivity actually increased by 18% when the company shifted to remote work.",
      },
    ],
  },
  {
    id: "r-a2-1",
    level: "A2",
    type: "Dialogue",
    title: "At the Doctor's Office",
    preview: "A practical dialogue with common medical vocabulary...",
    fullText: `At the Doctor's Office

Doctor: Good morning! How are you feeling today?

Patient: Good morning, doctor. I'm not feeling very well. I have a headache and a sore throat.

Doctor: I see. How long have you had these symptoms?

Patient: Since yesterday. I also have a fever. I took my temperature this morning, and it was 38 degrees.

Doctor: Let me examine you. Open your mouth and say "ah." Yes, your throat is red and swollen. Have you been coughing?

Patient: Yes, a little bit. And I feel very tired.

Doctor: It sounds like you have a common cold or possibly the flu. I'll do a quick test to be sure. In the meantime, I recommend you rest at home. Drink plenty of water and take paracetamol for the fever.

Patient: How often should I take the medicine?

Doctor: Take it every four to six hours. Don't exceed six tablets per day. If your fever doesn't go down in three days, come back and see me.

Patient: Will I need antibiotics?

Doctor: Not yet. We'll see how you feel in a few days. Most viral infections clear up on their own. If it gets worse, we can consider antibiotics.

Patient: Thank you, doctor. I'll follow your advice.

Doctor: Get plenty of rest, and don't hesitate to call if you need anything. Take care!`,
    wordCount: 380,
    estimatedMinutes: 4,
    vocabulary: [
      { word: "symptoms", definition: "signs that show you have a disease or illness" },
      { word: "fever", definition: "an abnormally high body temperature" },
      { word: "swollen", definition: "enlarged or puffed up" },
      { word: "antibiotics", definition: "medicines that kill bacteria and treat infections" },
    ],
    comprehensionQuestions: [
      {
        id: "q1",
        question: "How often should the patient take the paracetamol?",
        options: [
          "Every two hours",
          "Every four to six hours",
          "Once a day",
          "Twice a day",
        ],
        correctAnswer: 1,
        explanation: "The doctor says: 'Take it every four to six hours.'",
      },
      {
        id: "q2",
        question: "What is the patient's temperature?",
        options: ["36 degrees", "37 degrees", "38 degrees", "39 degrees"],
        correctAnswer: 2,
        explanation: "The patient says: 'I took my temperature this morning, and it was 38 degrees.'",
      },
    ],
  },
];

export function getAllArticles(): ReadingArticle[] {
  return articles;
}

export function getArticlesByLevel(level: CefrLevel): ReadingArticle[] {
  return articles.filter((article) => article.level === level);
}

export function getArticleById(id: string): ReadingArticle | null {
  return articles.find((article) => article.id === id) ?? null;
}
