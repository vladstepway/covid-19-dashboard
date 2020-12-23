/* eslint-disable no-undef */
import Keyboard from '../modules/components/keyboard';

describe('Add class', () => {
  test('It should add class to html element', () => {
    const keyboard = new Keyboard();
    keyboard.show();
    expect(keyboard.element.classList.contains('show')).toBe(true);
  });
});

describe('Hide class', () => {
  test('It should remove added class from html element', () => {
    const keyboard = new Keyboard();
    keyboard.show();
    const countOfClassesBeforeRemove = keyboard.element.classList.length;
    keyboard.hide();
    expect(keyboard.element.classList.length).toBe(countOfClassesBeforeRemove - 1);
    expect(keyboard.element.classList.contains('show')).toBe(false);
  });
});
