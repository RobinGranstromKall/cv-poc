import React, {useState} from 'react';
import {Row} from "../components/Row";
import {Column} from "../components/Column";
import {openai} from "../openai-client";

const sampleAssignments =
`Assistansbolaget. January 2021 - December 2022
  
The product is a tow service with several frontends, both internal and public, and an app for the salvagers.
General stack was: React, sass, react-redux, react-router.

Before the summer of 2022, we would rewrite the entire project to increase code quality.
I that time i have had an unofficial leadership role in the frontend team for about a year and at the start of this project my role was changed to Tech Lead.
===
Lägenhetsbyte. January 2020 - December 2020

I was tasked with leading the development of a React Native app.
It was largely a copying and mobile adaptation of the existing website.
I had 2 consultants who were part of my team, both of whom were new to react native, so there was also a bit of mentoring involved in this project
===
Bofink AB. January 2019 - December 2019

Worked primarily with React Native, React, Express.js, LoopBack. Also some smaller projects in Java.
Various technical products around mortgages and other fintech. Made, among other things, an app to compare mortgages, white-label product for applying for loans and also a mortgage platform.`

function CompetenceMatrix() {
  const api = openai.v1();
  const [text, setText] = useState<string>(sampleAssignments);
  const [matrix, setMatrix] = useState<string[]>([]);

  function generateMatrix() {
    const systemPrompt = `Identify the competences and time working with each competence in the following assignments. The assignments are separated by '==='.`;
    const messages: ChatMessages = [{content: systemPrompt, role: 'system'}, {role: "user", content: text}];
    console.log("Identifying competences:", text)
    api.chat.create({
      messages,
      model: 'gpt-3.5-turbo',
      max_tokens: 500,
      n:3,

    }).then(({choices}: any) => {
      const competenceMatrix = choices[0].message.content;
      const competenceArray = choices.map((choice: any) => choice.message.content);
      console.log("competenceArray:", competenceArray);
      console.log("competences:", competenceMatrix);
      setMatrix(competenceMatrix.split("\n"))

    }).catch((error: any) => {
      console.log(error);
    });
  }



  return (
    <Row>
      <Column>
        <p>
          <textarea cols={50} rows={20} value={text} onChange={(event) => setText(event.target.value)}/>
        </p>
        <button onClick={() => generateMatrix()}>Click me to identify competences</button>
      </Column>
      <Column>
        <p>
          {matrix.join("\n")}
        </p>
      </Column>
    </Row>
  );
}

export default CompetenceMatrix;
