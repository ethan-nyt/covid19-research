import stateData from './states';
import countyData from './counties';

const removeSpaces = str => str.split('').filter(c => c !== ' ').join('');

// convert the state and county data to an array of objects
// since this is immutable data, it doesn't need to go in the class.

export default class DataSet {
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
   *    plant: [{ name: 'tree', type: 'plant' }]
   * }
   * @param { Array } rows could be this.data, could be some filtered subset of this.data
   * @param { String } column the column to group by.
   * @return { Object } the given rows grouped together by the given column
   */
  groupBy = (rows, column) => {
    const result = {};
    rows.forEach(row => {
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
   * Filters the data array based on a condition.
   * @param { Object } condition containing keys: 'column', 'operator', 'comparator'
   * @return { Array } all the rows in this.data that match the condition
   */
  filter = ({ column, operator, comparator = '' }) => {
    if (!column || !operator) {
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
  
  /**
   * TODO this seems off - aggregating total deaths was 5x actual reported number...
   * @param { Array } rows the data to iterate
   * @param { String } column the column to aggregate
   * @param { String } metric one of ['sum', ...others]
   * @return { Number } the given column aggregated according to the given metric across the entire data set.
   * example: aggregate([{ deaths: 1 }, { deaths: 4}, { deaths: 7 }], 'deaths', 'sum') ==> 12
   */
  aggregate = (rows, column, metric) => {
    switch (metric) {
      case 'sum':
        return rows.reduce((sum, row) => sum + parseInt(row[column]), 0);
      case 'average':
        return rows.reduce((sum, row) => sum + parseInt(row[column]), 0) / rows.length;
      default:
        return 0;
    }
  }
}

export const states = new DataSet(stateData, 'state');
console.log('state data sorted by date:', states.filter({ column: 'state', operator: '===', comparator: 'New York' }).sort((a, b) => a.date - b.date));
export const counties = new DataSet(countyData, 'county');

