export default class Element {
  constructor(elem, id) {
    this.element = document.createElement(elem);
    if (id !== undefined) {
      this.element.id = id;
      this.element.classList.add(id, 'screen-element');
    }
  }

  attach(container) {
    container.append(this.element);
  }

  update() {
    return this;
  }

  init() {
    return this;
  }
}
