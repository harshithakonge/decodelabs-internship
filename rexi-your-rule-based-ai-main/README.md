# Rexi: Your Rule-Based AI

Build a complete, polished web application called "REXI 🤖 — Rule-Based AI Assistant". This is a rule-based chatbot project: do NOT use any LLM, OpenAI/Gemini API, RAG, vector DB, LangChain, or any external AI API. All intelligence must come from predefined rules (if/elif/else style priority-ordered rule engine) and predefined response data.

TECH: React + TypeScript, modern responsive CSS, LocalStorage for chat history and preferences. Fully functional, not a mockup.

RULE ENGINE (priority order, check top to bottom — do NOT randomly keyword-match):
1. Empty input (prevent send)
2. Exit commands: bye, exit, quit, goodbye → farewell response
3. AI-related: "what is AI?", "what is artificial intelligence?", "tell me about AI" → "Artificial Intelligence (AI) is the field of creating systems that can perform tasks that normally require human intelligence."
4. Machine Learning: "what is machine learning?", "tell me about ML" → "Machine Learning is a branch of AI where computers learn patterns from data and use them to make predictions or decisions."
5. Deep Learning: "what is deep learning?" → "Deep Learning is a type of machine learning that uses neural networks with multiple layers."
6. Chatbot: "what is a chatbot?" → "A chatbot is a software application designed to communicate with users through text or voice."
7. Programming: "what is programming?", "what is Python?", "what is Java?", "what is C?" with informative predefined answers
8. General: "who are you?", "what can you do?", "help"
9. Greetings: hello, hi, hey, good morning/afternoon/evening → friendly greeting, e.g. "Hello! 👋 I'm Rexi. I'm a rule-based AI chatbot. How can I help you?"
10. Fallback: "I'm still learning! 🤖 I don't have a predefined response for that yet."
So "Hello, what is AI?" must answer the AI question, not the greeting. Keep the rule engine code simple and readable — student-friendly, using clear variables, functions, conditions, string processing, lists/dictionaries, and loops. Separate UI components from chatbot rules.

MULTILINGUAL: Language selector top-right (English, Kannada, हिन्दी, తెలుగు). All predefined responses translated via predefined data inside the rule system (no translation API). Language choice persisted in LocalStorage.

CHAT HISTORY: Real history — every user message and Rexi response shown with timestamps (e.g. 10:42 AM), persisted in LocalStorage so it survives refresh. New Chat button and Clear History button (clears and resets conversation).

ATTACHMENTS: A [+] button near the input opens a menu with "🖼 Add Image" and "🎥 Add Video". Images render inline in the chat bubble with the file name; videos render in an HTML5 video player with play/pause, volume, fullscreen. Local files only (object URLs / base64), no external upload, no AI vision. Empty message prevention, Enter to send, send button.

UI: Premium modern interface, blue gradient theme inspired by #0F172A → #1D4ED8 → #2563EB → #38BDF8, but keep the chat panel clean white/translucent in light mode (not all bright blue). Desktop layout: LEFT SIDEBAR (Rexi 🤖 logo + "Rexi / Rule-Based AI", New Chat button, Quick Topics: 🧠 Artificial Intelligence, 📊 Machine Learning, 🐍 Python, 💬 Chatbots — each sends the corresponding question; About Rexi section: "Rexi is a rule-based AI chatbot created to demonstrate decision-making using predefined rules and control-flow logic." plus Features list: ✓ Rule-based responses ✓ Multiple languages ✓ Chat history ✓ Image support ✓ Video support ✓ Light / Dark mode; bottom: 🗑 Clear History and 🌙/☀ theme toggle) + MAIN CHAT AREA (header: Rexi avatar, "Rexi", "● Online • Rule-based assistant", language selector on right).

CHAT AREA: rounded bubbles — user messages right-aligned blue gradient white text; Rexi left-aligned very light blue/white bubble dark text; subtle (not excessive) message appear animations. EMPTY STATE: big 🤖, "Hi, I'm Rexi", "Your rule-based AI learning assistant.", "Ask me something to get started.", suggestion cards "What is AI?", "What is Machine Learning?", "What is Python?", "What can you do?" that send the question on click.

INPUT BAR: [ + ] [ Message Rexi... ] [ ➤ ].

DARK MODE: proper dark navy/slate panel with good contrast; theme persisted in LocalStorage; toggle label switches 🌙 Dark Mode / ☀ Light Mode.

RESPONSIVE: works on desktop, laptop, tablet, mobile; on small screens collapse/hide the sidebar (hamburger toggle) and the chat fills the screen.

ERROR HANDLING: wrap message processing in error handling; on failure show "⚠️ Something went wrong. Please try again." — app must never crash.

CODE ORGANIZATION:
src/
├── components/ (Sidebar, Header, ChatWindow, MessageBubble, MessageInput, LanguageSelector, ThemeToggle)
├── chatbot/ (rules, responses, languages)
├── utils/ (storage)
├── App
└── main

STYLE: clean, modern, minimal, professional; rounded cards, soft shadows, blue gradients, smooth hovers, good spacing/typography. Avoid excessive neon, cartoonish UI, or overloaded dashboards. No placeholder buttons — every visible button must work.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3fba9cff-cba0-496e-af00-f9c954358908).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
