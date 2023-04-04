import React, {useState} from "react";
import {openai} from "../openai-client";
import {Row} from "../components/Row";
import {Column} from "../components/Column";

export function Translation() {
  const api = openai.v1();
  const [text, setText] = useState("This is a text that i have written");
  const [translation, setTranslation] = useState("");

  function identifyLanguage() {
    const systemPrompt = `Identify the language of the following sentence. Only respond with the language code. Don't add the full language. Preserve line breaks.`;
    const messages: ChatMessages = [{content: systemPrompt, role: 'system'}, {content: text, role: 'user'}];
    console.log("Identifying language for:", text)
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
    api.chat.create({
      messages: [{role: "system", content: systemPrompt}, {
        role: "system",
        content: "Only respond with the translated text"
      }, {content: text, role: 'user'}],
      model: 'gpt-3.5-turbo',
      max_tokens: 50,
      n: 1,
    }).then(({choices}: any) => {
      const translatedString = choices[0].message.content;
      console.log("translatedString ", translatedString)
      setTranslation(translatedString)
    }).catch((error: any) => {
      console.log(error);
    });
  }

  return (
    <Row>
      <Column>
        <textarea cols={50} rows={8} defaultValue={text} onChange={(val) => setText(val.target.value)}/>
        <button onClick={() => identifyLanguage()}>Click me for translation</button>
      </Column>
      <Column>
        <p>
          {translation}
        </p>
      </Column>
    </Row>
  );
}
