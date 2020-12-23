import humanFormat from 'human-format';
import Element from './helpers/element';
import Core from '../core/core';

import cat from '../../assets/tenor.gif';

export default class Table extends Element {
  constructor(elem, id) {
    super(elem, id);
    this.globalCases = {};
    this.countries = [];

    this.country = '';
    this.cases = '';
    this.deaths = '';
    this.recovered = '';

    this.absolute = true;
    this.today = true;

    this.init();
  }

  init() {
    this.element.innerHTML = `
      <h2 class="me-1" data-country>World</h2> 
      <div class="wrapper d-flex align-items-center">
        <label class="form-check-label me-1" for="table-checkbox-today">Today</label>
        <input class="form-check-input me-1" id="table-checkbox-today" type="checkbox" checked>
        <label class="form-check-label me-1" for="table-checkbox-absolute">Absolute</label>
        <input class="form-check-input me-1" id="table-checkbox-absolute" type="checkbox" checked>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" data-full-screen>
        </div>
      </div>
      <table class="table table-hover">
        <thead>
        <tr>
          <th>Cases:</th>
          <th>Deaths:</th>
          <th>Recovered:</th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td data-cases></td>
            <td data-deaths></td>
            <td data-recovered></td>
          </tr>
        </tbody>
      </table>
      <div class="table__image-container mt-5">
        <img class="table__image" src=${cat} alt="gif with a cat">
      </div>
  `;

    this.country = this.element.querySelector('[data-country]');
    this.cases = this.element.querySelector('[data-cases]');
    this.deaths = this.element.querySelector('[data-deaths]');
    this.recovered = this.element.querySelector('[data-recovered]');

    this.element.querySelector('#table-checkbox-today').addEventListener('change', () => {
      this.today = !this.today;
      this.clearTable();
      this.setTable(Core.currentCountry);
    });

    this.element.querySelector('#table-checkbox-absolute').addEventListener('change', () => {
      this.absolute = !this.absolute;
      this.clearTable();
      this.setTable(Core.currentCountry);
    });
  }

  setTable(country) {
    let divisor = 1;

    if (this.absolute === false) {
      divisor = this.globalCases.population / 100000;
    }

    const precision = 4;

    let searchObject = this.globalCases;
    if (country === '' || country === undefined) {
      this.country.textContent = 'World';
    } else {
      this.country.textContent = country;
      searchObject = this.countries.find((cntr) => cntr
        .country
        .toLowerCase() === country.toLowerCase());
    }

    if (this.today) {
      this.cases.textContent = humanFormat(parseFloat(
        (searchObject.todayCases / divisor).toFixed(precision),
      ));
      this.deaths.textContent = humanFormat(parseFloat(
        (searchObject.todayDeaths / divisor).toFixed(precision),
      ));
      this.recovered.textContent = humanFormat(parseFloat(
        (searchObject.todayRecovered / divisor).toFixed(precision),
      ));
    } else if (!this.today) {
      this.cases.textContent = humanFormat(parseFloat(
        (searchObject.cases / divisor).toFixed(precision),
      ));
      this.deaths.textContent = humanFormat(parseFloat(
        (searchObject.deaths / divisor).toFixed(precision),
      ));
      this.recovered.textContent = humanFormat(parseFloat(
        (searchObject.recovered / divisor).toFixed(precision),
      ));
    }
  }

  clearTable() {
    this.country.textContent = '';
    this.cases.textContent = '';
    this.deaths.textContent = '';
    this.recovered.textContent = '';
  }

  update(subject) {
    this.globalCases = { ...subject.globalTodayCases };
    this.countries = [...subject.countriesTodayCases];
    this.setTable(Core.currentCountry);
  }
}
