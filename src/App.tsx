import React, {useState} from 'react'
import './App.css'
import {OpenAI} from 'node-openai';
import {Row} from "./components/Row";
import {Column} from "./components/Column";

const openai = new OpenAI({
  organization: import.meta.env.VITE_OPENAI_ORGANIZATION_ID,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

function Translation() {
  const api = openai.v1();
  const [text, setText] = useState("This is a text that i have written");
  const [translation, setTranslation] = useState("");
  function identifyLanguage() {
    const systemPrompt = `Identify the language of the following sentence. Only respond with the language code. Don't add the full language.`;
    const messages: {
      role: "user" | "system" | "assistant";
      content: string;
    }[] = [{content: systemPrompt, role: 'system'}, {content: text, role: 'user'}];
    api.chat.create({
      messages,
      model: 'gpt-3.5-turbo',
      max_tokens: 50,
      n: 1,
    }).then(({choices}: any) => {
      const language = choices[0].message.content;
      console.log("language", language);
      translate(language)

    }).catch((error: any) => {
      console.log(error);
    });
  }

  function translate(language: string) {
    let lang;
    switch (language.toLowerCase()) {
      case "Swedish":
      case "sv":
        lang = "English";
        break;
      default:
      case "English":
      case "en":
        lang = "Swedish";
        break;
    }
    const systemPrompt = `Translate the following sentence to ${lang} only respond with the translated text without a dot`;
    const prompt =`Translate the following sentence to ${lang}: ${text}`;
    console.log(prompt)
    api.chat.create({
      messages: [{role: "system", content: systemPrompt}, {role: "system", content: "Only respond with the translated text"},{content: text, role: 'user'}],
      model: 'gpt-3.5-turbo',
      max_tokens: 50,
      n: 1,
    }).then(({choices}: any) => {
      const translatedString = choices[0].message.content;
      console.log("translatedString",translatedString)
      setTranslation(translatedString)
    }).catch((error: any) => {
      console.log(error);
    });
  }
  return (
    <Row>
      <Column>
        <textarea defaultValue={text} onChange={(val) => setText(val.target.value)}/>
        <button onClick={() => identifyLanguage()}>Click me</button>
      </Column>
      <Column>
        <p>
          {translation}
        </p>
      </Column>
    </Row>
  );
}

function App() {

  return (
    <div className="App">
      <Translation />
    </div>
  )
}

export default App
