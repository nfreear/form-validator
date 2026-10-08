import MyInputElement from './MyInputElement.js';

const { customElements, HTMLFormElement } = globalThis;

/**
 * Run `checkValidity()` on all fields in a HTML form, triggering `invalid` events.
 *
 * @author Nick Freear, 06-Oct-2026.
 */
export default class FormValidator {
  #fieldRegex;
  #target;
  #form;
  #states = [];

  get form () { return this.#form; }
  get states () { return this.#states; }

  get #elements () { return Array.from(this.#form.elements); }
  get #fields () { return this.#elements.filter((el) => this.#fieldRegex.test(el.tagName)); } // el.tagName !== 'OUTPUT'); }
  get #validFields () { return this.#states.filter(it => it.valid); }
  get #length () { return this.#fields.length; }

  get formValid () {
    return !!Math.floor(this.#validFields.length / this.#length);
  }

  /* get #reduce () {
    const initial = true;
    const result = this.#states.reduce((acc, current) => current.valid === false, initial);
  } */

  constructor (formSelector = 0, fieldRegex, target = document) {
    this.#fieldRegex = fieldRegex || /input|select|textarea/i;
    this.#target = target;
    if (typeof formSelector === 'number') {
      this.#form = this.#target.forms[parseInt(formSelector)];
    }
    else if (typeof formSelector === 'string') {
      this.#form = this.#target.querySelector(formSelector);
    }
    else if (formSelector instanceof HTMLFormElement) {
      this.#form = formSelector;
    }
    console.assert(this.#form, `Missing <form> element: ${formSelector}`);
    console.assert(this.#length, 'Missing form elements');
    console.debug('Form validator:', this);
  }

  defineElement (tagName = 'my-input') {
    return customElements.define(tagName, MyInputElement);
  }

  validate () { return this.checkAllValidity(); }

  checkAllValidity () {
    console.assert(this.#fields.length, 'Missing fields');

    this.#states = this.#fields.map((elem, idx) => {
      const name = elem.name || elem.id || elem.tagName.toLowerCase();
      console.assert(elem.willValidate && elem.checkValidity, `willValidate false ${name}`);
      return {
        idx,
        elem,
        name,
        type: elem.type,
        value: elem.value,
        valid: elem.checkValidity(),
        validity: elem.validity,
        message: elem.validationMessage,
      };
    });

    return this.formValid;
  }

  /* report (selector = 'my-feedback') {
    this.#states.forEach((it) => {
      const feedbackElem = it.elem.closest(selector);
      console.assert(feedbackElem, `Missing feedback element: ${it.name}`);
      if (feedbackElem) {
        feedbackElem.message = it.valid ? '' : it.message;
        feedbackElem.valid = it.valid;
      }
    });
  } */

  addSubmitEventHandler () {
    this.#form.addEventListener('submit', (ev) => {
      this.validate();
      // this.report();
      if (!this.formValid) {
        ev.preventDefault();
      }
      console.debug('Valid? (submit)', this.formValid, this);
    });
  }

  addPreSubmitEventHandler (buttonSelector = '[type = submit]') {
    const submitButton = this.#form.querySelector(buttonSelector);
    console.assert(submitButton, 'Missing submit button');
    submitButton.addEventListener('click', (ev) => {
      this.validate();
      // this.report();
      if (!this.formValid) {
        ev.preventDefault();
      }
      console.debug('Valid? (pre-submit)', this.formValid, this);
    });
  }
}

export { FormValidator, MyInputElement };
