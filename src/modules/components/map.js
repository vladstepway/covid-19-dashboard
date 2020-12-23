import humanFormat from 'human-format';
import geoData from '../../assets/countries.geo.json';
import 'leaflet';
import Element from './helpers/element';
import Core from '../core/core';

export default class Map extends Element {
  constructor(elem, id) {
    super(elem, id);
    this.mapContainer = '';
    this.geoJson = '';
    this.absolute = true;
    this.currentField = 'cases';
    this.init();
  }

  init() {
    this.element.innerHTML = `
      <div class="wrapper d-flex justify-content-start align-items-center">
        <div class="d-flex align-items-center mb-2">
          <div class="me-1">
            <select class="form-select" name="field" id="map-select">
              <option value="cases">Cumulative cases</option>
              <option value="deaths">Cumulative deaths</option>
              <option value="recovered">Cumulative recovered</option>
              <option value="todayCases">New cases(Today)</option>
              <option value="todayDeaths">New deaths(Today)</option>
              <option value="todayRecovered">New recovered(Today)</option>
            </select>
          </div>
          <label class="form-check-label me-1" for="map-checkbox-absolute">Absolute</label>
          <input class="form-check-input me-1" id="map-checkbox-absolute" type="checkbox" checked>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" data-full-screen>
          </div>
        </div>
      </div>
      <div id="mapid"></div>
  `;

    this.element.querySelector('#map-select').addEventListener('change', (e) => {
      this.currentField = e.currentTarget.value;
      this.setMap(this.currentField);
    });

    this.element.querySelector('#map-checkbox-absolute').addEventListener('change', () => {
      this.absolute = !this.absolute;
      this.setMap(this.currentField);
    });
  }

  setMap(field) {
    const { L } = window;

    if (this.mapContainer) {
      this.mapContainer.off();
      this.mapContainer.remove();
    }
    this.mapContainer = L.map('mapid', {
      worldCopyJump: true,
    });

    L.tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
      attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      minZoom: 2,
      maxZoom: 4,
      subdomains: 'abcd',
      accessToken: Core.mapToken,
    }).addTo(this.mapContainer);

    let maxCases = 0;
    if (this.absolute) {
      maxCases = Math.max(...this.countries.map((country) => country[field]));
    } else {
      maxCases = Math
        .max(...this.countries.map((country) => country[field] / (country.population / 100000)));
    }

    this.geoJson = L.geoJson(geoData).addTo(this.mapContainer);
    this.mapContainer.fitBounds(this.geoJson.getBounds());

    this.geoJson.eachLayer((layer) => {
      const currentCountry = this.countries
        .find((country) => country.countryInfo?.iso3?.startsWith(layer.feature.id));

      if (currentCountry) {
        let countryCases = currentCountry?.[field];
        let divisor = 1;
        let precision = 0;

        if (this.absolute === false) {
          divisor = currentCountry.population / 100000;
          precision = 4;
        }

        countryCases /= divisor;

        layer.setStyle({
          color: `hsl(${(1 - countryCases / maxCases) * 120}, 100%, 50%)`,
        });

        let { lat, lng } = layer.getCenter();
        switch (layer.feature.id) {
          case 'RUS':
            lat += 10;
            lng -= 50;
            break;
          case 'CAN':
            lat += 10;
            lng -= 50;
            break;
          case 'CHN':
            lat += 10;
            lng -= 10;
            break;
          case 'AUS':
            lat += 10;
            lng -= 10;
            break;
          case 'USA':
            lat += 20;
            lng += 50;
            break;
          default:
            break;
        }

        layer.addEventListener('click', () => {
          document.querySelector('#cases-input').value = currentCountry?.country;
          Core.currentCountry = currentCountry?.country;
          Core.notify();
        });

        const tooltip = L.tooltip()
          .setContent(`${layer.feature.properties.name} <br> ${field}: ${humanFormat(+countryCases.toFixed(precision))}`)
          .setLatLng([lat, lng]);
        layer.bindTooltip(tooltip);
      }
    });

    Map.setLegend(this.mapContainer, L);
  }

  static setLegend(map, L) {
    const mapLegend = L.control({ position: 'topright' });
    mapLegend.onAdd = () => {
      const container = L.DomUtil.create('div', 'card');
      container.innerHTML = `
         <div class="card-header legend-header">
           Number of cases<br>relative to other<br>countries:
         </div>
          <ul class="list-group list-group-flush">
           <li class="list-group-item legend-item legend-item_blue">No information</li>
           <li class="list-group-item legend-item legend-item_green">Low</li>
           <li class="list-group-item legend-item legend-item_orange">Average</li>
           <li class="list-group-item legend-item legend-item_red">High</li>
         </ul>
      `;
      return container;
    };
    mapLegend.addTo(map);
  }

  update(subject) {
    this.globalCases = { ...subject.globalTodayCases };
    this.countries = [...subject.countriesTodayCases].filter((country) => country.population > 0);
    this.setMap(this.currentField);
  }
}
