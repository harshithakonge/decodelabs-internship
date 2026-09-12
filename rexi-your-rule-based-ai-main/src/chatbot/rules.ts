// Rexi's rule engine.
// The rules are checked strictly from top to bottom (if / else-if style).
// The FIRST rule that matches wins, so "Hello, what is AI?" answers the AI rule
// because the AI rule sits above the greeting rule.

import type { LanguageCode } from "./languages";
import { getResponse, type ResponseKey } from "./responses";

// ---------- 1. String processing helpers ----------

/** Lowercase, trim and remove punctuation so matching is predictable. */
export function cleanInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/[?!.,;:'"()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when the cleaned message contains any of the given keywords. */
function containsAny(message: string, keywords: string[]): boolean {
  for (const keyword of keywords) {
    if (message.includes(keyword)) {
      return true;
    }
  }
  return false;
}

/** True when the message contains any keyword as a whole word (used for "c", "hi"). */
function containsWord(message: string, words: string[]): boolean {
  const messageWords = message.split(" ");
  for (const word of words) {
    if (messageWords.includes(word)) {
      return true;
    }
  }
  return false;
}

// ---------- 2. Keyword lists for every rule ----------

const EXIT_WORDS = ["bye", "goodbye", "exit", "quit", "see you"];

const AI_WORDS = ["artificial intelligence", "what is ai", "about ai", " ai ", "ai?"];

const ML_WORDS = ["machine learning", " ml", "ml "];

const DEEP_LEARNING_WORDS = ["deep learning", "neural network"];

const CHATBOT_WORDS = ["chatbot", "chat bot"];

const PYTHON_WORDS = ["python"];
const JAVA_WORDS = ["java"];
const C_WORDS = ["c language", "c programming"];
const PROGRAMMING_WORDS = ["programming", "coding", "programme", "program"];

const WHO_WORDS = ["who are you", "your name", "who r u", "about you", "about rexi"];
const CAN_DO_WORDS = ["what can you do", "your features", "capabilities", "what do you do"];
const HELP_WORDS = ["help", "how to use", "guide"];

const GREETING_WORDS = [
  "hello",
  "hey",
  "good morning",
  "good afternoon",
  "good evening",
  "namaste",
  "namaskara",
];

// ---------- 3. The engine ----------

export type RuleResult = {
  key: ResponseKey;
  reply: string;
  isFarewell: boolean;
};

/**
 * Decide which predefined answer fits the user's message.
 * Returns both the matched rule name and the translated reply text.
 */
export function getBotResponse(userInput: string, language: LanguageCode): RuleResult {
  const message = ` ${cleanInput(userInput)} `;

  let key: ResponseKey;

  // Rule 2 — exit commands
  if (containsAny(message, EXIT_WORDS)) {
    key = "farewell";
  }
  // Rule 3 — artificial intelligence
  else if (containsAny(message, AI_WORDS)) {
    key = "ai";
  }
  // Rule 4 — machine learning
  else if (containsAny(message, ML_WORDS)) {
    key = "ml";
  }
  // Rule 5 — deep learning
  else if (containsAny(message, DEEP_LEARNING_WORDS)) {
    key = "deepLearning";
  }
  // Rule 6 — chatbots
  else if (containsAny(message, CHATBOT_WORDS)) {
    key = "chatbot";
  }
  // Rule 7 — programming languages
  else if (containsAny(message, PYTHON_WORDS)) {
    key = "python";
  } else if (containsAny(message, JAVA_WORDS)) {
    key = "java";
  } else if (containsAny(message, C_WORDS) || containsWord(message, ["c"])) {
    key = "c";
  } else if (containsAny(message, PROGRAMMING_WORDS)) {
    key = "programming";
  }
  // Rule 8 — general questions about Rexi
  else if (containsAny(message, WHO_WORDS)) {
    key = "whoAreYou";
  } else if (containsAny(message, CAN_DO_WORDS)) {
    key = "whatCanYouDo";
  } else if (containsAny(message, HELP_WORDS)) {
    key = "help";
  }
  // Rule 9 — greetings (checked late, so questions win)
  else if (containsAny(message, GREETING_WORDS) || containsWord(message, ["hi"])) {
    key = "greeting";
  }
  // Rule 10 — fallback
  else {
    key = "fallback";
  }

  return {
    key,
    reply: getResponse(language, key),
    isFarewell: key === "farewell",
  };
}

/** Reply used when the user sends only an attachment and no text. */
export function getAttachmentResponse(kind: "image" | "video", language: LanguageCode): string {
  return getResponse(language, kind === "image" ? "attachmentImage" : "attachmentVideo");
}

/** Reply used when something unexpected fails. */
export function getErrorResponse(language: LanguageCode): string {
  return getResponse(language, "error");
}
