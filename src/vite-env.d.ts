/// <reference types="vite/client" />
type ChatMessage = {
  role: "user" | "system" | "assistant";
  content: string;
};

type ChatMessages = ChatMessage[];
