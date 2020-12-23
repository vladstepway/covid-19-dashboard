export default class Keyboard {
  constructor(input) {
    this.element = document.createElement('div');
    this.input = input;
    this.posStart = 0;
    this.posEnd = 0;
  }

  init(container) {
    this.element.classList.add('keyboard');
    this.element.innerHTML = `
      <div class="btn-group" role="group">
        <button data-key="char" class="btn btn-secondary">q</button>
        <button data-key="char" type="button" class="btn btn-secondary">w</button>
        <button data-key="char" type="button" class="btn btn-secondary">e</button>
        <button data-key="char" type="button" class="btn btn-secondary">r</button>
        <button data-key="char" type="button" class="btn btn-secondary">t</button>
        <button data-key="char" type="button" class="btn btn-secondary">y</button>
        <button data-key="char" type="button" class="btn btn-secondary">u</button>
        <button data-key="char" type="button" class="btn btn-secondary">i</button>
        <button data-key="char" type="button" class="btn btn-secondary">o</button>
        <button data-key="char" type="button" class="btn btn-secondary">p</button>
      </div>
       <div class="btn-group" role="group">
        <button data-key="char" type="button" class="btn btn-secondary">a</button>
        <button data-key="char" type="button" class="btn btn-secondary">s</button>
        <button data-key="char" type="button" class="btn btn-secondary">d</button>
        <button data-key="char" type="button" class="btn btn-secondary">f</button>
        <button data-key="char" type="button" class="btn btn-secondary">g</button>
        <button data-key="char" type="button" class="btn btn-secondary">h</button>
        <button data-key="char" type="button" class="btn btn-secondary">j</button>
        <button data-key="char" type="button" class="btn btn-secondary">k</button>
        <button data-key="char" type="button" class="btn btn-secondary">l</button>
      </div>
      <div class="btn-group" role="group">
        <button data-key="char" type="button" class="btn btn-secondary">z</button>
        <button data-key="char" type="button" class="btn btn-secondary">x</button>
        <button data-key="char" type="button" class="btn btn-secondary">c</button>
        <button data-key="char" type="button" class="btn btn-secondary">v</button>
        <button data-key="char" type="button" class="btn btn-secondary">b</button>
        <button data-key="char" type="button" class="btn btn-secondary">n</button>
        <button data-key="char" type="button" class="btn btn-secondary">m</button>
      </div>
      <div class="btn-group" role="group">
        <button data-key="move-left" type="button" class="btn btn-secondary">←</button>
        <button data-key="move-right" type="button" class="btn btn-secondary">→</button>
        <button data-key="space" type="button" class="btn btn-secondary">――</button>
        <button data-key="backspace" type="button" class="btn btn-secondary">BackSpace⇦</button>
        <button data-key="hide" type="button" class="btn btn-secondary">⇓🖮</button>
      </div>
    `;
    container.append(this.element);
    this.element.addEventListener('click', (event) => {
      const { target } = event;
      this.posStart = this.input.selectionStart;
      this.posEnd = this.input.selectionEnd;
      switch (target.getAttribute('data-key')) {
        default:
          return;
        case 'char':
          this.enterChar(target.textContent);
          break;
        case 'move-left':
          this.moveLeft();
          break;
        case 'move-right':
          this.moveRight();
          break;
        case 'space':
          this.space();
          break;
        case 'backspace':
          this.backspace();
          break;
        case 'hide':
          this.hide();
          break;
      }
    });
  }

  show() {
    this.element.classList.add('show');
  }

  hide() {
    this.element.classList.remove('show');
  }

  enterChar(value) {
    this.input.value = `${this.input.value.substring(0, this.posStart)}${value}${this.input.value.substring(this.posEnd)}`;
    this.input.setSelectionRange(this.posStart + 1, this.posStart + 1);
    this.input.focus();
    this.input.dispatchEvent(new Event('input'));
  }

  moveLeft() {
    if (this.posStart > 0) {
      this.input.setSelectionRange(this.posStart - 1, this.posStart - 1);
    }
    this.input.focus();
  }

  moveRight() {
    this.input.setSelectionRange(this.posEnd + 1, this.posEnd + 1);
    this.input.focus();
  }

  space() {
    this.input.value = `${this.input.value.substring(0, this.posStart)} ${this.input.value.substring(this.posEnd)}`;
    this.input.setSelectionRange(this.posStart + 1, this.posStart + 1);
    this.input.focus();
    this.input.dispatchEvent(new Event('input'));
  }

  backspace() {
    if (this.posEnd !== this.posStart) {
      this.input.value = `${this.input.value.substring(0, this.posStart)}${this.input.value.substring(this.posEnd)}`;
      this.input.setSelectionRange(this.posStart, this.posStart);
    } else {
      this.input.value = `${this.input.value.substring(0, this.posStart - 1)}${this.input.value.substring(this.posEnd)}`;
      if (this.posStart > 0) {
        this.input.dispatchEvent(new Event('input'));
        this.input.setSelectionRange(this.posStart - 1, this.posStart - 1);
      } else {
        this.input.setSelectionRange(this.posStart, this.posStart);
      }
    }
    this.input.focus();
  }
}
