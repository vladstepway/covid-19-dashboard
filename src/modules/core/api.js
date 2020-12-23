class Api {
  constructor() {
    this.ERROR_MESSAGE = 'Something went wrong! Please reload the page.';
    this.JAWG_TOKEN = 'NBu229HlRFQq8dvJg9rTnEMn8njT3faIUvttphclImEIYH9kcMTihg9QE13UZR4O';
    this.GLOBAL_TODAY_CASES_URL = 'https://disease.sh/v3/covid-19/all';
    this.COUNTRIES_TODAY_CASES_URL = 'https://disease.sh/v3/covid-19/countries';
    this.GLOBAL_HISTORICAL_CASES_URL = 'https://disease.sh/v3/covid-19/historical/all?lastdays=366';
    this.COUNTRY_HISTORICAL_CASES_URL = 'https://disease.sh/v3/covid-19/historical/PLACEHOLDER?lastdays=366';
  }

  /**
   *
   * @returns {Promise<globalTodayCases>}
   */
  getGlobalTodayCases() {
    return fetch(this.GLOBAL_TODAY_CASES_URL)
      .then((response) => response.json())
      .catch(() => {
        throw new Error(this.ERROR_MESSAGE);
      });
  }

  /**
   *
   * @returns {Promise<globalHistoricalCases>}
   */
  getGlobalHistoricalCases() {
    return fetch(this.GLOBAL_HISTORICAL_CASES_URL)
      .then((response) => response.json())
      .catch(() => {
        throw new Error(this.ERROR_MESSAGE);
      });
  }

  /**
   *
   * @param {string} country name, iso2, iso3, or country ID code
   * @returns {Promise<countryHistoricalCases>}
   */
  getCountryHistoricalCases(country) {
    return fetch(this.COUNTRY_HISTORICAL_CASES_URL.replace('PLACEHOLDER', country))
      .then((response) => response.json())
      .catch(() => {
        throw new Error(this.ERROR_MESSAGE);
      });
  }

  /**
   *
   * @returns {Promise<countryCase[]>}
   */
  getCountriesTodayCases() {
    return fetch(this.COUNTRIES_TODAY_CASES_URL)
      .then((response) => response.json())
      .catch(() => {
        throw new Error(this.ERROR_MESSAGE);
      });
  }
}

const APIInstance = new Api();
export default APIInstance;

/**
 * @typedef {Object} globalTodayCases
 * @property {number} updated
 * @property {number} cases
 * @property {number} todayCases
 * @property {number} deaths
 * @property {number} todayDeaths
 * @property {number} recovered
 * @property {number} todayRecovered
 * @property {number} active
 * @property {number} critical
 * @property {number} casesPerOneMillion
 * @property {number} deathsPerOneMillion
 * @property {number} tests
 * @property {number} testsPerOneMillion
 * @property {number} population
 * @property {number} oneCasePerPeople
 * @property {number} oneDeathPerPeople
 * @property {number} oneTestPerPeople
 * @property {number} activePerOneMillion
 * @property {number} recoveredPerOneMillion
 * @property {number} criticalPerOneMillion
 * @property {number} affectedCountries
 */

/**
 * @typedef {Object} cases
 * @property {number} number of cases
 */

/**
 * @typedef {Object} deaths
 * @property {number} number of cases
 */

/**
 * @typedef {Object} recovered
 * @property {number} number of cases
 */

/**
 * @typedef {Object} globalHistoricalCases
 * @property {cases} cases
 * @property {deaths} deaths
 * @property {recovered} recovered
 */

/**
 * @typedef {Object} countryCase
 * @property {number} updated
 * @property {string} country
 * @property {countryInfo} info about country
 * @property {number} cases
 * @property {number} todayCases
 * @property {number} deaths
 * @property {number} todayDeaths
 * @property {number} recovered
 * @property {number} todayRecovered
 * @property {number} active
 * @property {number} critical
 * @property {number} casesPerOneMillion
 * @property {number} deathsPerOneMillion
 * @property {number} tests
 * @property {number} testsPerOneMillion
 * @property {number} population
 * @property {string} continent
 * @property {number} oneCasePerPeople
 * @property {number} oneDeathPerPeople
 * @property {number} activePerOneMillion
 * @property {number} recoveredPerOneMillion
 * @property {number} criticalPerOneMillion
 */

/**
 * @typedef {Object} countryInfo
 * @property {number} _id
 * @property {string} iso2: "RU"
 * @property {string} iso3: "RUS"
 * @property {number} lat
 * @property {number} long
 * @property {string} flagURL
 */

/**
 * @typedef {Object} countryHistoricalCases
 * @property {string} country
 * @property {string[]} province
 * @property {globalHistoricalCases} timeline
 *
 */
