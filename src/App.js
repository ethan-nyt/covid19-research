import React from 'react';
import { states, counties } from './data/cleaner'
import './App.css';
import Chart from './Chart'
import { Dropdown } from 'semantic-ui-react';

class App extends React.Component {
  state = {
    dataSet: states.filter({ column: 'state', operator: '===', comparator: 'New York' }).sort((a, b) => a.date - b.date)
  };
  
  changeDataSet = (e, { value: dataSet }) => {
    this.setState({ dataSet });
  }
  
  render() {
    return (
      <div className="App">
        <div id="header">
          <h1>COVID-19 Analysis</h1>
        </div>
        <div id="control-panel">
          <Dropdown selection placeholder="states" options={[
            { text: 'state', value: states, key: 'state_dropdown_key' },
            { text: 'county', value: counties, key: 'county_dropdown_key' }
          ]}
          onChange={this.changeDataSet}/>
          <p>dropdown 2</p>
          <p>dropdown 3</p>
        </div>
        <div id="chart">
          <Chart data={this.state.dataSet} title="Number of cases in New York State over time" />
        </div>
        <div id="footer">
          <p>Ethan Lipkind</p>
        </div>
      </div>
    );
  }
}

export default App;
