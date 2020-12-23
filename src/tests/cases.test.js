/* eslint-disable no-undef */
import Cases from '../modules/components/cases';

describe('Add html elements with init() method', () => {
  test('It should add html elements in string form', () => {
    const temp = new Cases();
    temp.init();
    expect(typeof temp.element.innerHTML).toBe('string');
    expect(temp.element.innerHTML).not.toBe('');
  });
});
