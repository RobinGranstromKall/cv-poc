import React, { useState } from 'react'
import './App.css'
import { OpenAI } from 'node-openai';

const openai = new OpenAI({
  organization: import.meta.env.VITE_OPENAI_ORGANIZATION_ID,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

function Row({ children }: { children: React.ReactNode }) {
  return <div className="row">{children}</div>;
}

function Column({ children }: { children: React.ReactNode }) {
  return <div className="column">{children}</div>;
}
function App() {
  const [text, setText] = useState("This is a text");
  const [translation, setTranslation] = useState("");
  const api = openai.v1();

  function identifyLanguage() {
    const content = `Identify the language of the following sentence: "${text}", respond with either Swedish or English without punctuation.`;
    api.chat.create({
      messages: [{content, role: 'user'}],
      model: 'gpt-3.5-turbo',
      max_tokens: 5,
      n: 1,
    }).then(({choices}: any) => {
        const language = choices[0].message.content;
        console.log({language});
        translate(language)

    }).catch((error: any) => {
      console.log(error);
    });
  }

  function translate(language: string) {
    let lang;
    switch (language) {
      case "Swedish":
        lang = "English";
        break;
      default:
      case "English":
        lang = "Swedish";
        break;
    }
    const systemPrompt = `Translate the following sentence to ${lang}`;
    const prompt =`Translate the following sentence to ${lang}: ${text}`;
    console.log(prompt)
    api.chat.create({
      messages: [{role: "system", content: systemPrompt}, {role: "system", content: "Only respond with the translated text"},{content: text, role: 'user'}],
      model: 'gpt-3.5-turbo',
      max_tokens: 10,
      n: 1,
    }).then(({choices}: any) => {
      console.log({choices})
      setTranslation(choices[0].message.content)
    }).catch((error: any) => {
      console.log(error);
    });
  }
  return (
    <div className="App">
      <Row>
        <Column>
          <textarea defaultValue="This is a text" onChange={(val) => setText(val.target.value) } />
          <button onClick={() => identifyLanguage()}>Click me</button>
        </Column>
        <Column>
         <p>
            {translation}
          </p>
        </Column>
      </Row>
    </div>
  )
}

export default App
