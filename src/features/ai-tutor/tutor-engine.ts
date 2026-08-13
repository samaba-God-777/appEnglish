const responses: Array<{ match: RegExp; reply: string }> = [
  {
    match: /present perfect|have been|has been/i,
    reply:
      "Great question! The **present perfect** connects the past to now. Use it for:\n\n1. Experiences — \"I **have visited** London twice.\"\n2. Recent actions with present results — \"She **has lost** her keys (so she can't get in now).\"\n3. Unfinished time periods — \"We **have studied** a lot this week.\"\n\nQuick check: which sentence is correct?\nA) \"I have seen him yesterday.\"\nB) \"I saw him yesterday.\"",
  },
  {
    match: /conditional|would|if i/i,
    reply:
      "Conditionals are one of my favorite topics! Here is the map:\n\n- **Zero**: If you heat ice, it melts. (facts)\n- **First**: If it rains, I **will stay** home. (real future)\n- **Second**: If I **were** rich, I **would travel**. (imaginary present)\n- **Third**: If I **had studied**, I **would have passed**. (imaginary past)\n\nAt your B1 level, focus on mastering the second conditional. Want me to create 5 practice exercises?",
  },
  {
    match: /pronunciation|pronounce/i,
    reply:
      "Your pronunciation score is **86%** — strong! Based on your recent sessions, I recommend focusing on:\n\n1. The **/θ/ sound** in *think, thorough, through* — your tongue should touch your teeth.\n2. **Word stress** in longer words: pho-TO-gra-phy, not PHO-to-gra-phy.\n\nTry recording yourself in the Speaking module and I'll analyze it in detail.",
  },
  {
    match: /hola|español|spanish/i,
    reply:
      "¡Hola! Puedo explicarte en español cuando lo necesites. 🇵🇦\n\nMi recomendación: intenta que el 80% de nuestra conversación sea en inglés — es la forma más rápida de mejorar. Si no entiendes algo, escribe \"explain in Spanish\" y te lo aclaro.\n\nSo — what would you like to practice today: grammar, vocabulary, or conversation?",
  },
];

const fallback =
  "That's a great thing to work on! Based on your B1 level and recent activity, here's my suggestion:\n\n1. **Review** the difference between past simple and present perfect — it appeared in 3 of your recent mistakes.\n2. **Practice** 10 flashcards from your \"Still learning\" pile.\n3. **Speak** for 5 minutes in the Speaking module — your fluency improves fastest with daily practice.\n\nAsk me anything: grammar rules, word meanings, or just chat with me in English!";

export function getTutorReply(message: string): string {
  return responses.find((r) => r.match.test(message))?.reply ?? fallback;
}

export const suggestedPrompts = [
  "Explain the present perfect",
  "How do conditionals work?",
  "Help me with pronunciation",
  "Créame un plan de estudio",
];
