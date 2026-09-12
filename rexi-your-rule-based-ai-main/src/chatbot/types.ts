export type Attachment = {
  kind: "image" | "video";
  name: string;
  url: string;
};

export type ChatMessage = {
  id: string;
  sender: "user" | "rexi";
  text: string;
  time: string;
  attachment?: Attachment;
};

export type Theme = "light" | "dark";
