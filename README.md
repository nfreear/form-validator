
# form-validator

Custom error handling built on HTML5 form validation.

Features:

* Uses browser-supplied error messages
* Error messages are translated by the browser
* Supports native HTML `<input>`, `<select>`, `<textarea>`
* Supports [form-associated][fa] custom elements

Uses the following properties on [`HTMLInputElement`][inp] and other elements:
* `validity`
* `validationMessage`
* `willValidate`

Uses the following methods:
* `checkValidity()`

## Example

Given a HTML form:
```html
<form>
  <label for="name">Name</label>

  <my-input>
    <input id="name" name="name" minlength="2" required>
    <!-- Error messages appear here. -->
  </my-input>

  <button type="submit">Submit</button>
</form>
```

Setup the validator JavaScript:
```js
import FormValidator from 'my-form-validator';

// Attach to the first <form> on the page, default configuration.
const validator = new FormValidator();

// Run validation manually?
validator.validate();

// More useful: setup validation on pre-submit.
validator.addPreSubmitEventHandler();
validator.addBlurEventHandler();
```

## Accessibility


[fa]: https://web.dev/articles/more-capable-form-controls
[inp]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#instance_properties
