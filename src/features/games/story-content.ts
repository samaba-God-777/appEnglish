export type Ending = "great" | "good" | "bad";

export interface StoryChoice {
  label: string;
  next: string;
}

export interface StoryNode {
  id: string;
  text: string;
  choices: StoryChoice[];
  /** Present only on ending nodes. */
  ending?: Ending;
}

export const endingXp: Record<Ending, number> = { great: 150, good: 100, bad: 60 };

/** A branching "choose your path" story set in London — practical, functional English. */
export const storyNodes: Record<string, StoryNode> = {
  start: {
    id: "start",
    text: "You step off the train at St Pancras Station in London. Rain taps on the glass roof and your phone battery is almost dead. Your hotel is across the city. What do you do?",
    choices: [
      { label: "Take the London Underground", next: "tube" },
      { label: "Hail a black cab", next: "taxi" },
      { label: "Ask a stranger for directions", next: "directions" },
    ],
  },
  tube: {
    id: "tube",
    text: "You buy an Oyster card and go down into the Underground. “Mind the gap!” announces a voice. The map is a maze of colourful lines.",
    choices: [
      { label: "Follow the Piccadilly line to your stop", next: "tubeRight" },
      { label: "Jump on the first train that arrives", next: "tubeWrong" },
    ],
  },
  tubeRight: {
    id: "tubeRight",
    text: "Smart choice — the Piccadilly line heads straight towards your stop. On the way, you even help a lost tourist find their platform.",
    choices: [{ label: "Continue to the hotel", next: "hotelGood" }],
  },
  tubeWrong: {
    id: "tubeWrong",
    text: "The train speeds off in the wrong direction. Forty minutes later you resurface, soaked and confused, miles from where you wanted to be.",
    choices: [{ label: "Go back up to the street and ask someone", next: "directions" }],
  },
  taxi: {
    id: "taxi",
    text: "A gleaming black cab pulls over. “Where to, mate?” asks the driver with a friendly grin.",
    choices: [
      { label: "Give the full hotel address politely", next: "taxiRide" },
      { label: "Just say “city centre”", next: "taxiVague" },
    ],
  },
  taxiRide: {
    id: "taxiRide",
    text: "The driver chats about the weather and football all the way. You practise your small talk and arrive relaxed and completely dry.",
    choices: [{ label: "Step out at the hotel", next: "hotelGood" }],
  },
  taxiVague: {
    id: "taxiVague",
    text: "“City centre's a big place!” the driver laughs. He drops you near Piccadilly Circus — close, but not quite your hotel.",
    choices: [{ label: "Walk on and ask a local for directions", next: "directions" }],
  },
  directions: {
    id: "directions",
    text: "You approach a friendly-looking local under an umbrella. “Excuse me, could you help me find my hotel?” you ask.",
    choices: [
      { label: "Show the address clearly on your map", next: "directionsGood" },
      { label: "Mumble the name and hope for the best", next: "directionsBad" },
    ],
  },
  directionsGood: {
    id: "directionsGood",
    text: "“Of course! It's just around the corner, past the red postbox.” You thank them warmly and stroll straight over.",
    choices: [{ label: "Arrive at the hotel", next: "hotelGood" }],
  },
  directionsBad: {
    id: "directionsBad",
    text: "They shrug apologetically — they couldn't quite understand the name. You wander a while longer before finding it on your own.",
    choices: [{ label: "Finally reach the hotel", next: "hotelOk" }],
  },
  hotelGood: {
    id: "hotelGood",
    text: "You reach the hotel dry and in great spirits. The receptionist smiles: “Welcome! You're just in time for our evening city tour. Care to join?”",
    choices: [
      { label: "Yes — join the city tour", next: "tourGreat" },
      { label: "No — rest in your room", next: "restGood" },
    ],
  },
  hotelOk: {
    id: "hotelOk",
    text: "You reach the hotel a little late and damp, but safe. The receptionist kindly offers you a warm cup of tea.",
    choices: [
      { label: "Join the late tour anyway", next: "tourGood" },
      { label: "Rest and recharge", next: "restBad" },
    ],
  },
  tourGreat: {
    id: "tourGreat",
    text: "On the tour you see Big Ben glowing at dusk, cross the River Thames, and pick up ten new words from your guide. A perfect first evening in London — and your English is shining.",
    choices: [],
    ending: "great",
  },
  tourGood: {
    id: "tourGood",
    text: "You catch the last part of the tour, see the lights of the city and chat with other travellers. A good end to a bumpy day.",
    choices: [],
    ending: "good",
  },
  restGood: {
    id: "restGood",
    text: "You sleep well and wake up refreshed, ready to explore tomorrow with confidence. A calm, comfortable start to your trip.",
    choices: [],
    ending: "good",
  },
  restBad: {
    id: "restBad",
    text: "You rest, but as you drift off you hear laughter from the tour group outside. You can't help feeling you missed the best of the evening.",
    choices: [],
    ending: "bad",
  },
};

export const storyStart = "start";
