import humanFormat from 'human-format';
import Element from './helpers/element';

export default class Cases extends Element {
  constructor(elem, id) {
    super(elem, id);
    this.init();
  }

  init() {
    this.element.innerHTML = `
       <h2 class="text-center">Global cases:</h2>
       <h3 class="text-center cases-data" data-container></h3>
    `;
  }

  update(subject) {
    this.element.querySelector('[data-container]').textContent = humanFormat(subject.globalTodayCases.cases);
  }
}
