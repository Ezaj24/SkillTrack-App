// src/utils/QuoteManager.js

// === QUOTES LIST ===
// More quotes will be added in batches safely.
export const QUOTES = [
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
  },
  {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
    author: "Albert Einstein",
  },
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates",
  },
  {
    text: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Aristotle",
  },
  {
    text: "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.",
    author: "Nikola Tesla",
  },
  {
    text: "A man who has conquered himself is a man who has conquered the world.",
    author: "Zeno of Citium",
  },
  {
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
  },
  {
    text: "Knowing is not enough; we must apply. Willing is not enough; we must do.",
    author: "Leonardo da Vinci",
  },
  {
    text: "It is not death that a man should fear, but he should fear never beginning to live.",
    author: "Marcus Aurelius",
  },
  {
    text: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius",
  },
  {
    text: "Veni, vidi, vici. (I came, I saw, I conquered.)",
    author: "Julius Caesar",
  },
  {
    text: "A wise man can learn more from a foolish question than a fool can learn from a wise answer.",
    author: "Bruce Lee",
  },
  {
    text: "Courage is not having the strength to go on; it is going on when you don't have the strength.",
    author: "Napoleon Bonaparte",
  },
  {
    text: "The greatest wealth is to live content with little.",
    author: "Plato",
  },
  {
    text: "It always seems impossible until it is done.",
    author: "Nelson Mandela",
  },
  {
    text: "You become what you think about.",
    author: "Lao Tzu",
  },
  {
    text: "He who fears he will suffer, already suffers because he fears.",
    author: "Michel de Montaigne",
  },
  {
    text: "Great spirits have always encountered violent opposition from mediocre minds.",
    author: "Albert Einstein",
  }
  // ✨ I will add 980+ more in batches for you.
];

// === QUOTE SELECTION ===
// Returns a new quote each day for 24 hours
export function getQuoteOfTheDay() {
  const dateKey = new Date().toISOString().slice(0, 10);

  const hash = Array.from(dateKey).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  const index = hash % QUOTES.length;
  return QUOTES[index];
}
