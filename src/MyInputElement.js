const { HTMLElement } = window;

let elemCount = 0;

/**
 * A custom element to:
 *   1. Display an error message in a live-region below a form field,
 *   2. Copy `autocomplete`, `required` and other validation-related attributes to an `<input>` element.
 *
 * @see https://github.com/nfreear/elements/blob/main/src/components/MyInputElement.js
 * @customElement my-input
 */
export default class MyInputElement extends HTMLElement {
  #rateLimitMS = 500;
  // static #count = 0;
  #index;
  #prefix = 'feedback_';
  #input;
  #statusElem;
  #valid;
  #lastUpdate;

  set message (str) {
    setTimeout(() => { this.#statusElem.textContent = str; }, 25);
  }

  set valid (isValid) {
    this.#valid = isValid;
    this.setAttribute('valid', isValid);
    this.#statusElem.dataset.valid = isValid;
  }

  get message () { return this.#statusElem.textContent; }
  get #selector () { return this.getAttribute('selector') || 'input, select, textarea'; }

  constructor () {
    super();
    this.#index = elemCount;
    elemCount++;
    this.#createElements();
  }

  connectedCallback () {
    this.#input = this.querySelector(this.#selector);
    console.assert(this.#input, 'Missing input');
    const ID = `${this.#prefix}${this.#index}`;
    this.#input.setAttribute('aria-describedby', ID);
    this.id = ID;

    this.#input.addEventListener('invalid', (ev) => this.#onInvalid(ev));
  }

  #createElements () {
    const root = this.attachShadow({ mode: 'open' });
    const style = this.#createStyleElement();
    const slot = document.createElement('slot');
    // const icon = document.createElement('x-icon');
    const span = this.#statusElem = document.createElement('span');
    span.setAttribute('part', 'alert');
    span.setAttribute('role', 'alert');
    // icon.setAttribute('part', 'icon');
    root.appendChild(slot);
    root.appendChild(style);
    // root.appendChild(icon);
    root.appendChild(span);
  }

  #createStyleElement () {
    const style = document.createElement('style');
    style.textContent = `
  [ data-valid = false ]:before {
    content: var(--my-input-invalid-char, '❌') / 'Error:';
    margin-right: var(--my-input-invalid-char-margin, .3rem);
  }
    `;
    return style;
  }

  #onInvalid (event) {
    const delta = Date.now() - this.#lastUpdate;
    if (delta < this.#rateLimitMS) { // Rate limit the 'invalid' event.
      return;
    }
    this.#lastUpdate = Date.now();
    const { target } = event;
    this.message = target.validationMessage;
    this.valid = target.checkValidity();
    console.warn('Invalid:', target.name || target.id, event);
  }
}
