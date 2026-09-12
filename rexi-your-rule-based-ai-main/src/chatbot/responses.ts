// All of Rexi's answers are predefined text stored in this dictionary.
// Structure: RESPONSES[language][responseKey] = answer text.

import type { LanguageCode } from "./languages";

export type ResponseKey =
  | "farewell"
  | "ai"
  | "ml"
  | "deepLearning"
  | "chatbot"
  | "programming"
  | "python"
  | "java"
  | "c"
  | "whoAreYou"
  | "whatCanYouDo"
  | "help"
  | "greeting"
  | "fallback"
  | "error"
  | "attachmentImage"
  | "attachmentVideo";

export const RESPONSES: Record<LanguageCode, Record<ResponseKey, string>> = {
  en: {
    farewell: "Goodbye! 👋 It was nice chatting with you. Come back and ask me anything anytime.",
    ai: "Artificial Intelligence (AI) is the field of creating systems that can perform tasks that normally require human intelligence.",
    ml: "Machine Learning is a branch of AI where computers learn patterns from data and use them to make predictions or decisions.",
    deepLearning:
      "Deep Learning is a type of machine learning that uses neural networks with multiple layers.",
    chatbot:
      "A chatbot is a software application designed to communicate with users through text or voice.",
    programming:
      "Programming is the process of writing instructions that a computer can follow to solve a problem or complete a task.",
    python:
      "Python is a simple, readable, high-level programming language used for web development, data science, automation and AI.",
    java: "Java is an object-oriented programming language known for being platform independent — code runs anywhere a Java Virtual Machine exists.",
    c: "C is a fast, low-level structured programming language widely used for operating systems, embedded systems and system software.",
    whoAreYou:
      "I'm Rexi 🤖 — a rule-based AI assistant. I don't use any machine learning model; I answer using predefined rules and responses.",
    whatCanYouDo:
      "I can explain AI, Machine Learning, Deep Learning, chatbots and programming languages like Python, Java and C. I also speak four languages, remember our chat, and accept images and videos.",
    help: "Try asking: 'What is AI?', 'What is Machine Learning?', 'What is Python?' or 'Who are you?'. Use the + button to attach an image or video, and say 'bye' to end the chat.",
    greeting: "Hello! 👋 I'm Rexi. I'm a rule-based AI chatbot. How can I help you?",
    fallback: "I'm still learning! 🤖 I don't have a predefined response for that yet.",
    error: "⚠️ Something went wrong. Please try again.",
    attachmentImage: "Nice image! 🖼 I can display it, but as a rule-based bot I can't analyse it.",
    attachmentVideo: "Thanks for the video! 🎥 You can play it right here in the chat.",
  },
  kn: {
    farewell: "ವಿದಾಯ! 👋 ನಿಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡಿದ್ದು ಸಂತೋಷ. ಯಾವಾಗ ಬೇಕಾದರೂ ಮರಳಿ ಕೇಳಿ.",
    ai: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಎಂದರೆ ಸಾಮಾನ್ಯವಾಗಿ ಮಾನವ ಬುದ್ಧಿಮತ್ತೆ ಬೇಕಾಗುವ ಕೆಲಸಗಳನ್ನು ಮಾಡಬಲ್ಲ ವ್ಯವಸ್ಥೆಗಳನ್ನು ರೂಪಿಸುವ ಕ್ಷೇತ್ರ.",
    ml: "ಮಷೀನ್ ಲರ್ನಿಂಗ್ AI ಯ ಒಂದು ಶಾಖೆ, ಇದರಲ್ಲಿ ಕಂಪ್ಯೂಟರ್‌ಗಳು ದತ್ತಾಂಶದಿಂದ ಮಾದರಿಗಳನ್ನು ಕಲಿತು ಭವಿಷ್ಯವಾಣಿ ಅಥವಾ ನಿರ್ಧಾರ ಮಾಡುತ್ತವೆ.",
    deepLearning:
      "ಡೀಪ್ ಲರ್ನಿಂಗ್ ಎಂಬುದು ಬಹು ಪದರಗಳ ನ್ಯೂರಲ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳನ್ನು ಬಳಸುವ ಮಷೀನ್ ಲರ್ನಿಂಗ್ ಪ್ರಕಾರ.",
    chatbot:
      "ಚಾಟ್‌ಬಾಟ್ ಎಂದರೆ ಪಠ್ಯ ಅಥವಾ ಧ್ವನಿ ಮೂಲಕ ಬಳಕೆದಾರರೊಂದಿಗೆ ಸಂವಹನ ನಡೆಸುವ ಸಾಫ್ಟ್‌ವೇರ್ ಅಪ್ಲಿಕೇಶನ್.",
    programming:
      "ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಎಂದರೆ ಸಮಸ್ಯೆ ಪರಿಹರಿಸಲು ಕಂಪ್ಯೂಟರ್ ಅನುಸರಿಸಬಹುದಾದ ಸೂಚನೆಗಳನ್ನು ಬರೆಯುವ ಪ್ರಕ್ರಿಯೆ.",
    python:
      "ಪೈಥಾನ್ ಸರಳ ಮತ್ತು ಓದಲು ಸುಲಭವಾದ ಉನ್ನತ ಮಟ್ಟದ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ; ವೆಬ್, ಡೇಟಾ ಸೈನ್ಸ್, ಆಟೊಮೇಶನ್ ಮತ್ತು AI ಗೆ ಬಳಸಲಾಗುತ್ತದೆ.",
    java: "ಜಾವಾ ಆಬ್ಜೆಕ್ಟ್-ಓರಿಯೆಂಟೆಡ್ ಭಾಷೆ; ಜಾವಾ ವರ್ಚುವಲ್ ಮಷೀನ್ ಇರುವ ಎಲ್ಲಿಯೂ ಕೋಡ್ ಚಲಾಯಿಸಬಹುದು.",
    c: "C ಒಂದು ವೇಗದ, ಕೆಳಮಟ್ಟದ ಸ್ಟ್ರಕ್ಚರ್ಡ್ ಭಾಷೆ; ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಂ ಮತ್ತು ಎಂಬೆಡೆಡ್ ಸಿಸ್ಟಂಗಳಿಗೆ ಬಳಸಲಾಗುತ್ತದೆ.",
    whoAreYou:
      "ನಾನು ರೆಕ್ಸಿ 🤖 — ನಿಯಮ ಆಧಾರಿತ AI ಸಹಾಯಕ. ನಾನು ಯಾವುದೇ ಮಷೀನ್ ಲರ್ನಿಂಗ್ ಮಾದರಿ ಬಳಸುವುದಿಲ್ಲ; ಪೂರ್ವನಿರ್ಧಾರಿತ ನಿಯಮಗಳಿಂದ ಉತ್ತರಿಸುತ್ತೇನೆ.",
    whatCanYouDo:
      "AI, ಮಷೀನ್ ಲರ್ನಿಂಗ್, ಡೀಪ್ ಲರ್ನಿಂಗ್, ಚಾಟ್‌ಬಾಟ್ ಮತ್ತು ಪೈಥಾನ್, ಜಾವಾ, C ಬಗ್ಗೆ ವಿವರಿಸಬಲ್ಲೆ. ನಾಲ್ಕು ಭಾಷೆಗಳನ್ನು ಮಾತನಾಡುತ್ತೇನೆ, ಚಾಟ್ ನೆನಪಿಡುತ್ತೇನೆ, ಚಿತ್ರ ಮತ್ತು ವಿಡಿಯೋ ಸ್ವೀಕರಿಸುತ್ತೇನೆ.",
    help: "ಹೀಗೆ ಕೇಳಿ ನೋಡಿ: 'AI ಎಂದರೇನು?', 'ಮಷೀನ್ ಲರ್ನಿಂಗ್ ಎಂದರೇನು?', 'ಪೈಥಾನ್ ಎಂದರೇನು?'. + ಬಟನ್‌ನಿಂದ ಚಿತ್ರ/ವಿಡಿಯೋ ಸೇರಿಸಿ, ಮುಗಿಸಲು 'bye' ಎಂದು ಹೇಳಿ.",
    greeting: "ನಮಸ್ಕಾರ! 👋 ನಾನು ರೆಕ್ಸಿ. ನಾನು ನಿಯಮ ಆಧಾರಿತ AI ಚಾಟ್‌ಬಾಟ್. ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    fallback: "ನಾನು ಇನ್ನೂ ಕಲಿಯುತ್ತಿದ್ದೇನೆ! 🤖 ಅದಕ್ಕೆ ನನ್ನಲ್ಲಿ ಪೂರ್ವನಿರ್ಧಾರಿತ ಉತ್ತರ ಇಲ್ಲ.",
    error: "⚠️ ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    attachmentImage: "ಸುಂದರ ಚಿತ್ರ! 🖼 ನಾನು ತೋರಿಸಬಲ್ಲೆ, ಆದರೆ ವಿಶ್ಲೇಷಿಸಲಾರೆ.",
    attachmentVideo: "ವಿಡಿಯೋಗೆ ಧನ್ಯವಾದ! 🎥 ಇಲ್ಲೇ ಚಾಟ್‌ನಲ್ಲಿ ಪ್ಲೇ ಮಾಡಬಹುದು.",
  },
  hi: {
    farewell: "अलविदा! 👋 आपसे बात करके अच्छा लगा। कभी भी लौटकर कुछ भी पूछें।",
    ai: "आर्टिफिशियल इंटेलिजेंस (AI) ऐसे सिस्टम बनाने का क्षेत्र है जो वे कार्य कर सकें जिनके लिए सामान्यतः मानव बुद्धि की आवश्यकता होती है।",
    ml: "मशीन लर्निंग AI की एक शाखा है जिसमें कंप्यूटर डेटा से पैटर्न सीखते हैं और उनका उपयोग भविष्यवाणी या निर्णय लेने के लिए करते हैं।",
    deepLearning:
      "डीप लर्निंग मशीन लर्निंग का एक प्रकार है जो कई परतों वाले न्यूरल नेटवर्क का उपयोग करता है।",
    chatbot:
      "चैटबॉट एक सॉफ़्टवेयर एप्लिकेशन है जो टेक्स्ट या आवाज़ के माध्यम से उपयोगकर्ताओं से संवाद करता है।",
    programming:
      "प्रोग्रामिंग वह प्रक्रिया है जिसमें ऐसे निर्देश लिखे जाते हैं जिनका पालन करके कंप्यूटर कोई समस्या हल करता है।",
    python:
      "पायथन एक सरल और पढ़ने में आसान उच्च-स्तरीय प्रोग्रामिंग भाषा है, जिसका उपयोग वेब, डेटा साइंस, ऑटोमेशन और AI में होता है।",
    java: "जावा एक ऑब्जेक्ट-ओरिएंटेड भाषा है जो प्लेटफ़ॉर्म-स्वतंत्र है — जहाँ जावा वर्चुअल मशीन है, वहाँ कोड चलता है।",
    c: "C एक तेज़, लो-लेवल स्ट्रक्चर्ड भाषा है जिसका उपयोग ऑपरेटिंग सिस्टम और एम्बेडेड सिस्टम में होता है।",
    whoAreYou:
      "मैं रेक्सी हूँ 🤖 — एक नियम-आधारित AI सहायक। मैं कोई मशीन लर्निंग मॉडल नहीं, बल्कि पूर्वनिर्धारित नियमों से उत्तर देता हूँ।",
    whatCanYouDo:
      "मैं AI, मशीन लर्निंग, डीप लर्निंग, चैटबॉट और पायथन, जावा, C समझा सकता हूँ। मैं चार भाषाएँ बोलता हूँ, चैट याद रखता हूँ और छवि/वीडियो स्वीकार करता हूँ।",
    help: "पूछकर देखें: 'AI क्या है?', 'मशीन लर्निंग क्या है?', 'पायथन क्या है?'। + बटन से छवि या वीडियो जोड़ें, और समाप्त करने के लिए 'bye' कहें।",
    greeting:
      "नमस्ते! 👋 मैं रेक्सी हूँ। मैं एक नियम-आधारित AI चैटबॉट हूँ। मैं कैसे मदद कर सकता हूँ?",
    fallback: "मैं अभी सीख रहा हूँ! 🤖 इसके लिए मेरे पास कोई पूर्वनिर्धारित उत्तर नहीं है।",
    error: "⚠️ कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    attachmentImage: "अच्छी छवि! 🖼 मैं इसे दिखा सकता हूँ, पर विश्लेषण नहीं कर सकता।",
    attachmentVideo: "वीडियो के लिए धन्यवाद! 🎥 आप इसे यहीं चैट में चला सकते हैं।",
  },
  te: {
    farewell: "వీడ్కోలు! 👋 మీతో మాట్లాడటం బాగుంది. ఎప్పుడైనా తిరిగి వచ్చి అడగండి.",
    ai: "ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ (AI) అంటే సాధారణంగా మానవ తెలివి అవసరమైన పనులను చేయగల వ్యవస్థలను తయారు చేసే రంగం.",
    ml: "మెషీన్ లెర్నింగ్ AI లో ఒక శాఖ; ఇందులో కంప్యూటర్లు డేటా నుండి నమూనాలు నేర్చుకుని అంచనాలు లేదా నిర్ణయాలు చేస్తాయి.",
    deepLearning:
      "డీప్ లెర్నింగ్ అనేది అనేక పొరల న్యూరల్ నెట్‌వర్క్‌లను ఉపయోగించే మెషీన్ లెర్నింగ్ రకం.",
    chatbot:
      "చాట్‌బాట్ అంటే టెక్స్ట్ లేదా వాయిస్ ద్వారా వినియోగదారులతో సంభాషించే సాఫ్ట్‌వేర్ అప్లికేషన్.",
    programming: "ప్రోగ్రామింగ్ అంటే సమస్యను పరిష్కరించడానికి కంప్యూటర్ అనుసరించే సూచనలను రాయడం.",
    python:
      "పైథాన్ సులభమైన, చదవడానికి తేలికైన హై-లెవెల్ ప్రోగ్రామింగ్ భాష; వెబ్, డేటా సైన్స్, ఆటోమేషన్, AI కి ఉపయోగిస్తారు.",
    java: "జావా ఒక ఆబ్జెక్ట్-ఓరియెంటెడ్ భాష; జావా వర్చువల్ మెషీన్ ఉన్న ఎక్కడైనా కోడ్ నడుస్తుంది.",
    c: "C వేగవంతమైన, లో-లెవెల్ స్ట్రక్చర్డ్ భాష; ఆపరేటింగ్ సిస్టమ్‌లు, ఎంబెడెడ్ సిస్టమ్‌లకు ఉపయోగిస్తారు.",
    whoAreYou:
      "నేను రెక్సీ 🤖 — నియమ ఆధారిత AI సహాయకుడు. నేను ఏ మెషీన్ లెర్నింగ్ మోడల్‌ను ఉపయోగించను; ముందే నిర్ణయించిన నియమాలతో సమాధానం ఇస్తాను.",
    whatCanYouDo:
      "AI, మెషీన్ లెర్నింగ్, డీప్ లెర్నింగ్, చాట్‌బాట్‌లు, పైథాన్, జావా, C గురించి వివరించగలను. నాలుగు భాషలు మాట్లాడతాను, చాట్ గుర్తుంచుకుంటాను, చిత్రాలు మరియు వీడియోలు స్వీకరిస్తాను.",
    help: "ఇలా అడగండి: 'AI అంటే ఏమిటి?', 'మెషీన్ లెర్నింగ్ అంటే ఏమిటి?', 'పైథాన్ అంటే ఏమిటి?'. + బటన్‌తో చిత్రం లేదా వీడియో జోడించండి, ముగించడానికి 'bye' అనండి.",
    greeting: "హాయ్! 👋 నేను రెక్సీ. నేను నియమ ఆధారిత AI చాట్‌బాట్. నేను ఎలా సహాయపడగలను?",
    fallback: "నేను ఇంకా నేర్చుకుంటున్నాను! 🤖 దానికి నా వద్ద ముందే నిర్ణయించిన సమాధానం లేదు.",
    error: "⚠️ ఏదో తప్పు జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    attachmentImage: "మంచి చిత్రం! 🖼 చూపించగలను కానీ విశ్లేషించలేను.",
    attachmentVideo: "వీడియోకు ధన్యవాదాలు! 🎥 ఇక్కడే చాట్‌లో ప్లే చేయవచ్చు.",
  },
};

export function getResponse(language: LanguageCode, key: ResponseKey): string {
  return RESPONSES[language][key];
}
