import FormValidator from '../../src/FormValidator.js';

export default function demoApp () {
  const validator = new FormValidator();

  validator.defineElement();
  validator.addPreSubmitEventHandler();
  validator.addBlurEventHandler();

  validator.form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const { elements } = ev.target;
    elements.output.value = '✅ Submitted';
    console.debug('Submit:', ev);
  });
}

if (import.meta.url.includes('run')) {
  demoApp();
}
