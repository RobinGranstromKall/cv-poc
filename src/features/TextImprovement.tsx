import React, {useState} from 'react';
import {Row} from "../components/Row";
import {Column} from "../components/Column";
import {openai} from "../openai-client";

const sampleText = `The product is a tow service with several frontends, both internal and public, and an app for the salvagers.
General stack was: React, sass, react-redux, react-router.

Before the summer of 2022, we would rewrite the entire project to increase code quality.
I that time i have had an unofficial leadership role in the frontend team for about a year and at the start of this project my role was changed to Tech Lead.
`

function TextImprovement() {
  const api = openai.v1();
  const [text, setText] = useState(sampleText);
  const [improvement, setImprovement] = useState("");

  function improveText() {
    const systemPrompt = `Improve the following sentence for a consultant resume. Only respond with the improved text!`;
    const messages: ChatMessages = [{content: systemPrompt, role: 'system'}, {content: text, role: 'user'}];
    console.log("Improving text:", text);
    api.chat.create({
      messages,
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      n: 1,
    }).then(({choices}: any) => {
      const improvementString = choices[0].message.content;
      console.log("improvement:", improvementString);
      setImprovement(improvementString)

    }).catch((error: any) => {
      console.log(error);
    });
  }

  return (
    <Row>
      <Column>
        <textarea cols={50} rows={8} defaultValue={text} onChange={(val) => setText(val.target.value)}/>
        <button onClick={() => improveText()}>Click me to improve the text</button>
      </Column>
      <Column>
        <p>
          {improvement}
        </p>
      </Column>
    </Row>
  );
}

export default TextImprovement;
