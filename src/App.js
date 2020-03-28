import React from 'react';
import { states, counties } from './data/cleaner'
import './App.css';

class App extends React.Component {
  
  render() {
    return (
      <div className="App">
        <div id="header">
          <h1>COVID-19 Analysis</h1>
        </div>
        <div id="control-panel">
          <p>dropdown 1</p>
          <p>dropdown 2</p>
          <p>dropdown 3</p>
        </div>
        <div id="chart">
          <p>chart placeholder</p>
        </div>
        <div id="footer">
          <p>Ethan Lipkind</p>
        </div>
      </div>
    );
  }
}

export default App;
