import stateData from './states';
import countyData from './counties';

const removeSpaces = str => str.split('').filter(c => c !== ' ').join('');

// convert the state and county data to an array of objects
// since this is immutable data, it doesn't need to go in the class.

class DataSet {
  constructor(dataString, type) {
    this.data = [];
  
    let cols, mod;
    if (type === 'state') {
      cols = ['date', 'state', 'fips', 'cases', 'deaths'];
      mod = 4;
    } else {
      cols = ['date', 'county', 'state', 'fips', 'cases', 'deaths'];
      mod = 5;
    }
    const splitArr = dataString.split(',');
    const arr = [];
    for (let i = 0; i < splitArr.length; i++) {
      if (i % mod === 0) {
        const strToSplit = removeSpaces(splitArr[i]);
        // cleaning the string lumped the deaths and next date columns together - separate them and insert the correct value.
        // all dates are 10 characters long
        const date = strToSplit.slice(-10);
        const deaths = strToSplit.slice(0, -10);
        if (deaths !== '') {
          arr.push(deaths);
        }
        if (date !== '') {
          arr.push(date);
        }
      } else {
        arr.push(splitArr[i]);
      }
    }
    
    for (let i = 0; i < arr.length; i += cols.length) {
      const row = cols.reduce((rowObj, column, j) => ({
        ...rowObj,
        [column]: arr[i + j],
      }), {});
      this.data.push(row);
    }
  }
  
  /**
   * Groups an array of objects into a single object with a key for each unique value in the given column
   *
   * for example, if this.data = [{ name: 'cat', type: 'animal' }, { name: 'tree', type: 'plant' }, { name: 'dog', type: 'animal' }]
   * this.groupBy('type')
   * would return this object:
   * {
   *    animal: [{ name: 'cat', type: 'animal' }, { name: 'dog', type: 'animal' }],
   *    fungus: [{ name: 'mushroom, type: 'fungus' }]
   * }
   * @param column
   */
  groupBy = (column) => {
    // TODO allow to group based on a condition?
    // for example, what if I want to see all states that had more than 100 cases after a certain date
    const result = {};
    this.data.forEach(row => {
      const group = row[column];
      if (result[group]) {
        result[group].push(row);
      } else {
        result[group] = [row];
      }
    });
    return result;
  }
  
  operatorMap = {
    '>': (row, column, comparator) => row[column] > comparator,
    '>=': (row, column, comparator) => row[column] >= comparator,
    '<': (row, column, comparator) => row[column] < comparator,
    '<=': (row, column, comparator) => row[column] <= comparator,
    '===': (row, column, comparator) => row[column] === comparator,
    '!==': (row, column, comparator) => row[column] !== comparator,
  }
  
  /**
   *
   * @param { Object } condition containing keys: 'column', 'operator', 'comparator'
   */
  filter = ({ column, operator, comparator }) => {
    if (!column || !operator || !comparator) {
      throw new Error('invalid input to filter');
    }
    const result = [];
    this.data.forEach(row => {
      const match = this.operatorMap[operator](row, column, comparator);
      if (match) {
        result.push(row);
      }
    });
    return result;
  }
}

export const states = new DataSet(stateData, 'state');
console.log('state level data filtered by state', states.filter({ column: 'fips', operator: '===', comparator: '53' }));
export const counties = new DataSet(countyData, 'county');
console.log('county level data grouped by fips', counties.groupBy('fips'));
