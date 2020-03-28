import React from 'react'
import Plot from 'react-plotly.js';

export default ({ data, title }) => {
  return (
    <Plot
      data={[
        {
          x: data.map(dataPoint => dataPoint.date),
          y: data.map(dataPoint => dataPoint.cases),
          type: 'scatter',
          mode: 'lines',
          marker: {color: 'red'},
        },
        {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
      ]}
      layout={ { title, width: 600, height: 600, xaxis: { range: [data[0].date, data[data.length - 1].date]} } }
    />
  );
}