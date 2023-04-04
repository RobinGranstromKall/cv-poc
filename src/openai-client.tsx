import {OpenAI} from "node-openai";

export const openai = new OpenAI({
  organization: import.meta.env.VITE_OPENAI_ORGANIZATION_ID,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
