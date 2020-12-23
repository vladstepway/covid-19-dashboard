import Snowflakes from 'magic-snowflakes';
import Element from './helpers/element';

export default class Header extends Element {
  constructor(elem, id) {
    super(elem, id);
    this.isSnowing = false;
    this.init();
  }

  init() {
    this.element.classList.add('container-fluid', 'mb-2', 'd-flex', 'align-items-center', 'justify-content-between');
    this.element.innerHTML = `
      <div class="row w-100">
        <div class="col-4 d-flex align-items-center">
          <div class="header__time fs-6 fs-md-5" data-container></div>
        </div>
        <div class="col-4 d-flex align-items-center justify-content-center">
          <h1 class="header__title text-center fs-2">Covid-19 Dashboard</h1>
        </div>
        <div class="button-container col-4 d-flex align-items-center justify-content-end"></div>
      </div>
    `;

    const snowButton = document.createElement('button');
    snowButton.textContent = 'Secret Button';
    snowButton.classList.add('btn', 'btn-warning', 'btn-sm');
    snowButton.addEventListener('click', () => {
      if (!this.isSnowing) {
        this.sf = new Snowflakes({
          color: '#3c99af',
          count: 100,
          minSize: 16,
          maxSize: 30,
        });
      } else {
        this.sf.destroy();
      }
      this.isSnowing = !this.isSnowing;
    });

    this.element.querySelector('.button-container').insertAdjacentElement('beforeend', snowButton);
  }

  update() {
    const dateNow = new Date();
    this.element.querySelector('[data-container]').textContent = `Last updated: ${dateNow.toLocaleDateString()} ${dateNow.toLocaleTimeString()}`;
  }
}
