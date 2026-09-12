import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "REXI 🤖 — Rule-Based AI Assistant" },
      {
        name: "description",
        content:
          "Rexi is a rule-based AI chatbot that answers questions about AI, Machine Learning and programming using predefined rules — in four languages.",
      },
      { property: "og:title", content: "REXI 🤖 — Rule-Based AI Assistant" },
      {
        property: "og:description",
        content:
          "Chat with Rexi, a rule-based assistant with multilingual answers, chat history, image and video support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});
