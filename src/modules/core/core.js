import API from './api';

class Core {
  constructor() {
    this.observers = [];

    this.countryHistoricalCases = {};
    this.countriesTodayCases = [];
    this.globalHistoricalCases = {};
    this.globalTodayCases = {};

    this.currentCountry = '';

    this.mapToken = API.JAWG_TOKEN;
  }

  getCountryHistoricalCases(country) {
    return API.getCountryHistoricalCases(country)
      .then((data) => {
        this.countryHistoricalCases = data;
        return data;
      });
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    const observerIndex = this.observers.indexOf(observer);
    this.observers.splice(observerIndex, 1);
  }

  notify() {
    this.observers.forEach((observer) => {
      observer.update(this);
    });
  }

  fetchData() {
    return Promise.all([
      API.getCountriesTodayCases(),
      API.getGlobalHistoricalCases(),
      API.getGlobalTodayCases(),
    ])
      .then((data) => {
        [this.countriesTodayCases, this.globalHistoricalCases, this.globalTodayCases] = [...data];
        this.notify();
        document.querySelector('.loading')?.remove();
      })
      .catch((e) => {
        document.querySelector('.loading__image')?.remove();
        alert(`Something went wrong. Please, reload the page.\n${e}`);
      });
  }
}

const core = new Core();
export default core;
