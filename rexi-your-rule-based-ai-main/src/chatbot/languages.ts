// Supported languages and the UI labels for each one.
// Everything is predefined data — no translation API is used anywhere.

export type LanguageCode = "en" | "kn" | "hi" | "te";

export const LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
];

export type UiStrings = {
  tagline: string;
  newChat: string;
  quickTopics: string;
  topicAi: string;
  topicMl: string;
  topicPython: string;
  topicChatbot: string;
  aboutTitle: string;
  aboutText: string;
  featuresTitle: string;
  features: string[];
  clearHistory: string;
  darkMode: string;
  lightMode: string;
  online: string;
  emptyTitle: string;
  emptySub: string;
  emptyHint: string;
  placeholder: string;
  addImage: string;
  addVideo: string;
  send: string;
  language: string;
  menu: string;
};

export const UI: Record<LanguageCode, UiStrings> = {
  en: {
    tagline: "Rexi / Rule-Based AI",
    newChat: "New Chat",
    quickTopics: "Quick Topics",
    topicAi: "🧠 Artificial Intelligence",
    topicMl: "📊 Machine Learning",
    topicPython: "🐍 Python",
    topicChatbot: "💬 Chatbots",
    aboutTitle: "About Rexi",
    aboutText:
      "Rexi is a rule-based AI chatbot created to demonstrate decision-making using predefined rules and control-flow logic.",
    featuresTitle: "Features",
    features: [
      "Rule-based responses",
      "Multiple languages",
      "Chat history",
      "Image support",
      "Video support",
      "Light / Dark mode",
    ],
    clearHistory: "🗑 Clear History",
    darkMode: "🌙 Dark Mode",
    lightMode: "☀ Light Mode",
    online: "● Online • Rule-based assistant",
    emptyTitle: "Hi, I'm Rexi",
    emptySub: "Your rule-based AI learning assistant.",
    emptyHint: "Ask me something to get started.",
    placeholder: "Message Rexi...",
    addImage: "🖼 Add Image",
    addVideo: "🎥 Add Video",
    send: "Send",
    language: "Language",
    menu: "Menu",
  },
  kn: {
    tagline: "ರೆಕ್ಸಿ / ನಿಯಮ ಆಧಾರಿತ AI",
    newChat: "ಹೊಸ ಚಾಟ್",
    quickTopics: "ತ್ವರಿತ ವಿಷಯಗಳು",
    topicAi: "🧠 ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ",
    topicMl: "📊 ಮಷೀನ್ ಲರ್ನಿಂಗ್",
    topicPython: "🐍 ಪೈಥಾನ್",
    topicChatbot: "💬 ಚಾಟ್‌ಬಾಟ್",
    aboutTitle: "ರೆಕ್ಸಿ ಬಗ್ಗೆ",
    aboutText:
      "ರೆಕ್ಸಿ ಒಂದು ನಿಯಮ ಆಧಾರಿತ AI ಚಾಟ್‌ಬಾಟ್, ಇದು ಪೂರ್ವನಿರ್ಧಾರಿತ ನಿಯಮಗಳು ಮತ್ತು ನಿಯಂತ್ರಣ ತರ್ಕದ ಮೂಲಕ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವುದನ್ನು ತೋರಿಸುತ್ತದೆ.",
    featuresTitle: "ವೈಶಿಷ್ಟ್ಯಗಳು",
    features: [
      "ನಿಯಮ ಆಧಾರಿತ ಉತ್ತರಗಳು",
      "ಹಲವು ಭಾಷೆಗಳು",
      "ಚಾಟ್ ಇತಿಹಾಸ",
      "ಚಿತ್ರ ಬೆಂಬಲ",
      "ವಿಡಿಯೋ ಬೆಂಬಲ",
      "ಲೈಟ್ / ಡಾರ್ಕ್ ಮೋಡ್",
    ],
    clearHistory: "🗑 ಇತಿಹಾಸ ಅಳಿಸಿ",
    darkMode: "🌙 ಡಾರ್ಕ್ ಮೋಡ್",
    lightMode: "☀ ಲೈಟ್ ಮೋಡ್",
    online: "● ಆನ್‌ಲೈನ್ • ನಿಯಮ ಆಧಾರಿತ ಸಹಾಯಕ",
    emptyTitle: "ನಮಸ್ಕಾರ, ನಾನು ರೆಕ್ಸಿ",
    emptySub: "ನಿಮ್ಮ ನಿಯಮ ಆಧಾರಿತ AI ಕಲಿಕಾ ಸಹಾಯಕ.",
    emptyHint: "ಪ್ರಾರಂಭಿಸಲು ನನ್ನನ್ನು ಏನಾದರೂ ಕೇಳಿ.",
    placeholder: "ರೆಕ್ಸಿಗೆ ಸಂದೇಶ...",
    addImage: "🖼 ಚಿತ್ರ ಸೇರಿಸಿ",
    addVideo: "🎥 ವಿಡಿಯೋ ಸೇರಿಸಿ",
    send: "ಕಳುಹಿಸಿ",
    language: "ಭಾಷೆ",
    menu: "ಮೆನು",
  },
  hi: {
    tagline: "रेक्सी / नियम-आधारित AI",
    newChat: "नई चैट",
    quickTopics: "त्वरित विषय",
    topicAi: "🧠 आर्टिफिशियल इंटेलिजेंस",
    topicMl: "📊 मशीन लर्निंग",
    topicPython: "🐍 पायथन",
    topicChatbot: "💬 चैटबॉट",
    aboutTitle: "रेक्सी के बारे में",
    aboutText:
      "रेक्सी एक नियम-आधारित AI चैटबॉट है, जो पूर्वनिर्धारित नियमों और नियंत्रण-प्रवाह तर्क से निर्णय लेने का प्रदर्शन करता है।",
    featuresTitle: "विशेषताएँ",
    features: [
      "नियम-आधारित उत्तर",
      "कई भाषाएँ",
      "चैट इतिहास",
      "छवि समर्थन",
      "वीडियो समर्थन",
      "लाइट / डार्क मोड",
    ],
    clearHistory: "🗑 इतिहास मिटाएँ",
    darkMode: "🌙 डार्क मोड",
    lightMode: "☀ लाइट मोड",
    online: "● ऑनलाइन • नियम-आधारित सहायक",
    emptyTitle: "नमस्ते, मैं रेक्सी हूँ",
    emptySub: "आपका नियम-आधारित AI लर्निंग असिस्टेंट।",
    emptyHint: "शुरू करने के लिए मुझसे कुछ पूछें।",
    placeholder: "रेक्सी को संदेश...",
    addImage: "🖼 छवि जोड़ें",
    addVideo: "🎥 वीडियो जोड़ें",
    send: "भेजें",
    language: "भाषा",
    menu: "मेनू",
  },
  te: {
    tagline: "రెక్సీ / నియమ ఆధారిత AI",
    newChat: "కొత్త చాట్",
    quickTopics: "త్వరిత అంశాలు",
    topicAi: "🧠 ఆర్టిఫిషియల్ ఇంటెలిజెన్స్",
    topicMl: "📊 మెషీన్ లెర్నింగ్",
    topicPython: "🐍 పైథాన్",
    topicChatbot: "💬 చాట్‌బాట్‌లు",
    aboutTitle: "రెక్సీ గురించి",
    aboutText:
      "రెక్సీ ఒక నియమ ఆధారిత AI చాట్‌బాట్. ఇది ముందే నిర్ణయించిన నియమాలు మరియు కంట్రోల్-ఫ్లో లాజిక్‌తో నిర్ణయాలు తీసుకోవడాన్ని చూపుతుంది.",
    featuresTitle: "ఫీచర్లు",
    features: [
      "నియమ ఆధారిత సమాధానాలు",
      "అనేక భాషలు",
      "చాట్ చరిత్ర",
      "చిత్రాల మద్దతు",
      "వీడియో మద్దతు",
      "లైట్ / డార్క్ మోడ్",
    ],
    clearHistory: "🗑 చరిత్రను తొలగించు",
    darkMode: "🌙 డార్క్ మోడ్",
    lightMode: "☀ లైట్ మోడ్",
    online: "● ఆన్‌లైన్ • నియమ ఆధారిత సహాయకుడు",
    emptyTitle: "హాయ్, నేను రెక్సీ",
    emptySub: "మీ నియమ ఆధారిత AI లెర్నింగ్ అసిస్టెంట్.",
    emptyHint: "ప్రారంభించడానికి నన్ను ఏదైనా అడగండి.",
    placeholder: "రెక్సీకి సందేశం...",
    addImage: "🖼 చిత్రం జోడించు",
    addVideo: "🎥 వీడియో జోడించు",
    send: "పంపు",
    language: "భాష",
    menu: "మెనూ",
  },
};
