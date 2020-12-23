import humanFormat from 'human-format';
import Element from './helpers/element';
import Core from '../core/core';
import Keyboard from './keyboard';

export default class List extends Element {
  constructor(elem, id) {
    super(elem, id);
    this.countries = [];
    this.tbody = '';
    this.currentField = 'cases';

    this.absolute = true;

    this.init();
  }

  init() {
    this.element.innerHTML = `
      <div class="wrapper d-flex flex-column justify-content-center align-items-center position-sticky top-0">
        <h2>Cases by country</h2>
        <div class="d-flex align-items-center me-auto mb-2">
          <button type="button" class="btn btn-success btn-sm me-1" data-keyboard>Keyboard</button>
          <label class="form-check-label me-1" for="list-checkbox-absolute">Absolute</label>
          <input class="form-check-input me-1" id="list-checkbox-absolute" type="checkbox" checked>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" data-full-screen>
          </div>
        </div>
        <input class="form-control mb-2" type="text" id="cases-input" placeholder="Country name">
        <select class="form-select mb-2" name="field" id="cases-select">
          <option value="cases">Cumulative cases</option>
          <option value="deaths">Cumulative deaths</option>
          <option value="recovered">Cumulative recovered</option>
          <option value="todayCases">New cases(Today)</option>
          <option value="todayDeaths">New deaths(Today)</option>
          <option value="todayRecovered">New recovered(Today)</option>
        </select>
      </div>
      <div class="table-container overflow-auto">
         <table class="table table-hover">
           <thead>
          <tr>
             <th colspan="2">Country:</th>
             <th data-field>Cases:</th>
          </tr>
          </thead>
           <tbody data-container>
    
           </tbody>
        </table>
      </div>
    `;
    this.tbody = this.element.querySelector('[data-container]');
    const input = this.element.querySelector('#cases-input');
    const keyboard = new Keyboard(input);
    keyboard.init(this.element);
    input.addEventListener('input', (e) => {
      this.filterTable(e.currentTarget.value);
    });
    this.element.querySelector('#cases-select').addEventListener('change', (e) => {
      input.value = '';
      this.currentField = e.currentTarget.value;
      this.clearTable();
      this.setTable(this.countries, this.currentField);
      Core.notify();
    });

    this.element.querySelector('#list-checkbox-absolute').addEventListener('change', () => {
      this.absolute = !this.absolute;
      input.value = '';
      this.clearTable();
      this.setTable(this.countries, this.currentField);
    });

    this.element.querySelector('[data-keyboard]').addEventListener('click', () => {
      if (keyboard.element.classList.contains('show')) {
        keyboard.hide();
      } else {
        keyboard.show();
      }
    });
  }

  setTable(countriesInfo, field) {
    this.element.querySelector('[data-field]').textContent = field;
    const countries = [...countriesInfo];
    countries.sort((a, b) => b[field] - a[field]);

    const tr = document.createElement('tr');
    tr.setAttribute('role', 'button');

    const td = document.createElement('td');

    const img = document.createElement('img');
    img.classList.add('flag-image');

    countries.forEach((country) => {
      const countryRow = tr.cloneNode();
      countryRow.addEventListener('click', (e) => {
        const casesInput = this.element.querySelector('#cases-input');
        casesInput.value = e.currentTarget.querySelector('.country-name').textContent;
        casesInput.dispatchEvent(new Event('input'));
        Core.currentCountry = casesInput.value;
        Core.notify();
      });

      const countryName = td.cloneNode();
      countryName.classList.add('country-name');

      const countryCases = td.cloneNode();
      countryName.textContent = country.country;

      let divisor = 1;

      if (this.absolute === false) {
        divisor = country.population / 100000;
      }

      const precision = 4;

      countryCases.textContent = humanFormat(parseFloat(
        (country[field] / divisor).toFixed(precision),
      ), {
        separator: '',
      });

      const countryFlag = td.cloneNode();

      const flagImg = img.cloneNode();
      flagImg.alt = country.country;
      flagImg.src = country.countryInfo.flag;
      countryFlag.append(flagImg);
      countryRow.append(countryFlag, countryName, countryCases);

      this.tbody.append(countryRow);
    });
  }

  clearTable() {
    this.tbody.innerHTML = '';
  }

  filterTable(input) {
    this.clearTable();
    if (input === '') {
      this.setTable(this.countries, this.currentField);
      Core.currentCountry = '';
      Core.notify();
    } else {
      const filteredCountries = this
        .countries
        .filter((country) => country.country.toLowerCase().startsWith(input.toLowerCase()));
      this.setTable(filteredCountries, this.currentField);
    }
  }

  update(subject) {
    this.countries = [...subject.countriesTodayCases];
    this.setTable(this.countries, this.currentField);
  }
}
