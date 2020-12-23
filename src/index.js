import core from './modules/core/core';
import App from './modules/app';
import Header from './modules/components/header';
import Cases from './modules/components/cases';
import List from './modules/components/list';
import Table from './modules/components/table';
import Chart from './modules/components/chart';
import MapClass from './modules/components/map';
import Footer from './modules/components/footer';

const header = new Header('header', 'header');
const cases = new Cases('div', 'cases');
const list = new List('div', 'list');
const table = new Table('div', 'myTable');
const chart = new Chart('div', 'chart');
const map = new MapClass('div', 'map');
const footer = new Footer('footer', 'footer');

const app = new App(header, cases, list, table, chart, map, footer);

app.render();

core.attach(header);
core.attach(cases);
core.attach(list);
core.attach(table);
core.attach(chart);
core.attach(map);
core.fetchData().then(() => {
  core.detach(header);
  core.detach(cases);
  core.detach(list);
  core.detach(map);
});
