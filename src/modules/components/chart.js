import Chart from 'chart.js';
import humanFormat from 'human-format';
import Element from './helpers/element';

export default class ChartElement extends Element {
  constructor(elem, id) {
    super(elem, id);
    this.globalHistoricalStatistics = {};
    this.countryHistoricalStatistics = {};

    this.currentCountry = '';
    this.absolute = true;
    this.today = false;
    this.currentField = 'cases';
    this.myChart = {};

    this.init();
  }

  init() {
    this.element.innerHTML = `
      <div class="chart-controls">
        <h2>Chart</h2>
        <div class="d-flex">
          <label class="form-check-label me-1" for="table-checkbox-absolute">Absolute</label>
          <input class="form-check-input me-1" id="table-checkbox-absolute" type="checkbox" checked>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" data-full-screen>
          </div>
        </div>
        <select class="form-select mb-2" name="field" id="cases-select">
          <option value="cases">Cumulative cases</option>
          <option value="deaths">Cumulative deaths</option>
          <option value="recovered">Cumulative recovered</option>
          <option value="dailyCases">Daily cases</option>
          <option value="dailyDeaths">Daily deaths</option>
          <option value="dailyRecovered">Daily recovered</option>
          <option value="globalFull">Full cumulative statistics</option>
        </select>
      </div>
      <div class="chart-container">
        <canvas id="myChart" width="300" height="500"></canvas>
      </div>
  `;

    this.element
      .querySelector('#table-checkbox-absolute')
      .addEventListener('change', () => {
        this.absolute = !this.absolute;
        this.updateChart(!!this.currentCountry);
      });
    this.element
      .querySelector('#cases-select')
      .addEventListener('change', (e) => {
        this.currentField = e.target.value;
        this.updateChart(!!this.currentCountry);
      });
  }

  static convertObjectToArray(object) {
    const map = new Map(Object.entries(object));
    const jsonValues = JSON.stringify([...map]);
    return JSON.parse(jsonValues);
  }

  static convertArrayToObject(array) {
    const map = new Map(array);
    return Object.fromEntries(map);
  }

  transformToRelative(statistics) {
    if (!this.absolute) {
      const precision = 4;
      const divisor = this.population / 100000;
      const cases = ChartElement.convertObjectToArray(statistics.cases);
      const deaths = ChartElement.convertObjectToArray(statistics.deaths);
      const recovered = ChartElement.convertObjectToArray(statistics.recovered);
      const relativeStatistics = {
        cases: ChartElement.convertArrayToObject(
          cases.map((c) => {
            const rVal = (c[1] / divisor).toFixed(precision);
            return [c[0], +rVal];
          }),
        ),
        deaths: ChartElement.convertArrayToObject(
          deaths.map((c) => {
            const rVal = (c[1] / divisor).toFixed(precision);
            return [c[0], +rVal];
          }),
        ),
        recovered: ChartElement.convertArrayToObject(
          recovered.map((c) => {
            const rVal = (c[1] / divisor).toFixed(precision);
            return [c[0], +rVal];
          }),
        ),
      };
      return relativeStatistics;
    }
    return statistics;
  }

  // updating chart
  updateChart(isCountrySelected) {
    if (isCountrySelected) {
      switch (this.currentField) {
        case 'dailyCases':
        case 'dailyDeaths':
        case 'dailyRecovered':
        case 'cases':
        case 'deaths':
        case 'recovered':
        case 'globalFull':
        default:
          this.setChart(
            this.currentLabel,
            this.transformToRelative(this.countryHistoricalStatistics),
          );
          break;
      }
    } else {
      switch (this.currentField) {
        case 'dailyCases':
        case 'dailyDeaths':
        case 'dailyRecovered':
        case 'cases':
        case 'deaths':
        case 'globalFull':
        case 'recovered':
        default:
          this.setChart(
            this.currentLabel,
            this.transformToRelative(this.globalHistoricalStatistics),
          );
          break;
      }
    }
  }

  transFormProps(object) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const array = ChartElement.convertObjectToArray(object);
    const transformedArr = array.map((c) => {
      const key = this.currentField.includes('daily')
        ? c[0]
        : months[+c[0].split('/')[0] - 1];
      return [key, c[1]];
    });

    if (this.currentField.includes('Full')) {
      return array;
    }

    const toTransform = this.currentField.includes('daily')
      ? ChartElement.transMap(array)
      : new Map(transformedArr);
    return Object.fromEntries(toTransform);
  }

  static transMap(cases) {
    const transformedStatisticsData = [];
    transformedStatisticsData.push(cases[0]);
    for (let i = 1; i < cases.length; i++) {
      let growth = cases[i][1] - cases[i - 1][1];
      if (growth < 0) {
        growth = cases[i - 1][1] - cases[i - 2][1];
      }
      transformedStatisticsData.push([cases[i][0], growth]);
    }
    return new Map(transformedStatisticsData);
  }

  getCurrentStatisticData(statistics) {
    switch (this.currentField) {
      case 'globalFull':
        return statistics;
      case 'deaths':
      case 'dailyDeaths':
        return this.transFormProps(statistics.deaths);
      case 'recovered':
      case 'dailyRecovered':
        return this.transFormProps(statistics.recovered);
      case 'cases':
      case 'dailyCases':
      default:
        return this.transFormProps(statistics.cases);
    }
  }

  // get color of chart depends on chosen dropdown value
  static getStatisticsColor(statisticField) {
    switch (statisticField) {
      case 'deaths':
      case 'dailyDeaths':
        return '#1a1a1a';
      case 'recovered':
      case 'dailyRecovered':
        return '#74d070';
      case 'cases':
      case 'dailyCases':
      default:
        return '#891414';
    }
  }

  // get current legend label depends on selected dropdown value
  static getCurrentLabel(statisticsField) {
    switch (statisticsField) {
      case 'dailyDeaths':
        return 'Daily deaths';
      case 'dailyCases':
        return 'Daily cases';
      case 'dailyRecovered':
        return 'Daily recovered';
      case 'deaths':
        return 'Deaths';
      case 'recovered':
        return 'Recovered';
      case 'cases':
      default:
        return 'Cases';
    }
  }

  // create config depends on chosen dropdown value
  createConfig(label, statistics) {
    // transform to months format
    const transformedStatistics = this.getCurrentStatisticData(statistics);

    let labels;
    let data;
    if (!this.currentField.toLowerCase().includes('full')) {
      labels = Object.keys(transformedStatistics);
      data = Object.values(transformedStatistics);
    }

    const backgroundColor = ChartElement.getStatisticsColor(this.currentField);
    const pointBorderColor = ChartElement.getStatisticsColor(this.currentField);
    const borderColor = ChartElement.getStatisticsColor(this.currentField);
    const pointBackgroundColor = ChartElement.getStatisticsColor(
      this.currentField,
    );
    const pointStyle = 'star'; // star, seems like CoRoNaViRuS OaOaOaOa

    const callbacks = {
      label: (context) => humanFormat(+context.value),
      // disabled, because chart.js library need to have an arg to work nice
      // eslint-disable-next-line no-unused-vars
      labelColor: (context) => backgroundColor,
    };
    const animation = {
      duration: 2000,
      easing: 'easeInOutElastic',
    };

    const legend = { display: true };
    const title = {
      display: true,
      text: label,
    };

    const statisticsLabels = Object.keys(statistics.cases);
    const casesValues = Object.values(statistics.cases);
    const deathsValues = Object.values(statistics.deaths);
    const recoveredValues = Object.values(statistics.recovered);
    const casesPointBorderColor = ChartElement.getStatisticsColor('cases');
    const casesBorderColor = ChartElement.getStatisticsColor('cases');
    const casesPointBackgroundColor = ChartElement.getStatisticsColor('cases');
    const deathsPointBorderColor = ChartElement.getStatisticsColor('deaths');
    const deathsBorderColor = ChartElement.getStatisticsColor('deaths');
    const deathsPointBackgroundColor = ChartElement.getStatisticsColor(
      'deaths',
    );
    const recoveredPointBorderColor = ChartElement.getStatisticsColor(
      'recovered',
    );
    const recoveredBorderColor = ChartElement.getStatisticsColor('recovered');
    const recoveredPointBackgroundColor = ChartElement.getStatisticsColor(
      'recovered',
    );
    const multilineData = {
      labels: statisticsLabels,
      datasets: [
        {
          label: 'Cases',
          data: casesValues,
          pointBorderColor: casesPointBorderColor,
          borderColor: casesBorderColor,
          pointBackgroundColor: deathsPointBackgroundColor,
          pointStyle,
        },
        {
          label: 'Deaths',
          data: deathsValues,
          pointBorderColor: deathsBorderColor,
          borderColor: deathsPointBorderColor,
          pointBackgroundColor: casesPointBackgroundColor,
          pointStyle,
        },
        {
          label: 'Recovered',
          data: recoveredValues,
          pointBorderColor: recoveredPointBorderColor,
          borderColor: recoveredBorderColor,
          pointBackgroundColor: recoveredPointBackgroundColor,
          pointStyle,
        },
      ],
    };
    const singleLineData = {
      labels,
      datasets: [
        {
          label: ChartElement.getCurrentLabel(this.currentField),
          data,
          pointBorderColor,
          borderColor,
          pointBackgroundColor,
          pointStyle,
        },
      ],
    };
    const barConfig = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: ChartElement.getCurrentLabel(this.currentField),
            barPercentage: 1,
            minBarLength: 2,
            data,
            backgroundColor,
          },
        ],
      },
      options: {
        responsive: true,
        legend,
        title,
        animation,
        tooltips: {
          mode: 'point',
          callbacks,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                maxRotation: 10,
                minRotation: 10,
              },
              gridLines: {
                offsetGridLines: true,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };
    const lineConfig = {
      type: 'line',
      data: this.currentField.toLowerCase().includes('full')
        ? multilineData
        : singleLineData,
      options: {
        responsive: true,
        legend,
        title,
        animation,
        plugins: {},
        tooltips: {
          mode: 'nearest',
          callbacks,
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'month',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    };

    return this.currentField.includes('daily')
      || this.currentField.toLowerCase().includes('full')
      ? lineConfig
      : barConfig;
  }

  // set chart with data
  setChart(label, statistics) {
    // deleting previous chart if it exists
    if (Object.keys(this.myChart).length !== 0) {
      this.myChart.destroy();
    }

    const ctx = this.element.querySelector('#myChart').getContext('2d');

    const config = this.createConfig(label, statistics);

    this.myChart = new Chart(ctx, config);
    this.myChart.options.maintainAspectRatio = false;
  }

  // receive new data from api to chart
  update(subject) {
    this.todayGlobalStatistics = { ...subject.globalTodayCases };
    this.countries = [...subject.countriesTodayCases];
    this.population = subject.globalTodayCases.population;
    if (subject.currentCountry === '') {
      this.currentLabel = 'World';
      this.currentCountry = '';
      this.globalHistoricalStatistics = subject.globalHistoricalCases;
      this.updateChart(!!subject.currentCountry);
    } else {
      subject.getCountryHistoricalCases(subject.currentCountry).then((data) => {
        this.countryHistoricalStatistics = data.timeline;
        this.currentCountry = subject.currentCountry;
        this.currentLabel = subject.currentCountry;
        this.population = this.countries.find(
          (c) => c.country.toLowerCase() === subject.currentCountry.toLowerCase(),
        ).population;
        this.updateChart(!!subject.currentCountry);
      });
    }
  }
}
