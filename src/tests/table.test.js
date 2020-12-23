/* eslint-disable no-undef */
import Table from '../modules/components/table';

describe("Set 'World'", () => {
  test("If country wasn't choosing set 'World'", () => {
    const table = new Table();
    table.init();
    expect(table.country.textContent).toBe('World');
  });
});

describe('Function set country name', () => {
  test('Set value to the table', () => {
    const table = new Table();
    table.init();
    const countryObj = { country: 'Belarus' };
    table.countries.push(countryObj);
    table.setTable(countryObj.country);
    expect(table.country.textContent).toBe(countryObj.country);
  });
});

describe('Function clear values', () => {
  test('Clear set empty value', () => {
    const table = new Table();
    table.init();
    const countryObj = {
      country: 'Belarus',
      cases: 17200,
      deaths: 1300,
      recovered: 149000,
    };
    table.countries.push(countryObj);
    table.setTable(countryObj.country);
    table.clearTable();
    expect(table.country.textContent).toBe('');
    expect(table.cases.textContent).toBe('');
    expect(table.deaths.textContent).toBe('');
    expect(table.recovered.textContent).toBe('');
  });
});
