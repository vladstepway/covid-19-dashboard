import corona from '../assets/coronavirus.png';

export default class App {
  constructor(...elements) {
    this.elements = elements;
  }

  render() {
    const loading = document.createElement('div');
    loading.classList.add('loading');
    const loadingImage = document.createElement('img');
    loadingImage.classList.add('loading__image');
    loadingImage.src = corona;
    loadingImage.alt = 'Bacteria';
    loading.append(loadingImage);

    const container = document.createElement('div');
    container.id = 'app';
    container.append(loading);

    this.elements.forEach((elem) => elem.attach(container));
    const body = document.querySelector('body');

    container.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-full-screen')) {
        const element = e.target.closest('.screen-element');
        element.classList.toggle('screen-element_full-screen');
        window.dispatchEvent(new Event('resize'));
      }
    });

    body.append(container);
  }
}
