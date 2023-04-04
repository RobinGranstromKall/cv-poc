import React from 'react'
import './App.css'
import {Translation} from "./features/Translation";
import TextImprovement from "./features/TextImprovement";
import IdentifyCompetences from "./features/IdentifyCompetences";
import CompetenceMatrix from "./features/CompetenceMatrix";

function App() {

  return (
    <div className="App">
      <Translation />
      <hr />
      <TextImprovement />
      <hr />
      <IdentifyCompetences />
      <hr />
      <CompetenceMatrix />
    </div>
  )
}

export default App
