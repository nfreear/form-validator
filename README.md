
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

This JavaScript library helps with the following [WCAG 2.2][] Success Criteria:
* [1.3.1 Info and Relationships][wcag:info-rel] (use `aria-describedby`)
* [3.3.1 Error Identification][wcag:error-id] (call-to-action)
* [3.3.3 Error Suggestion][wcag:error-hint] (more specific error messages)

[fa]: https://web.dev/articles/more-capable-form-controls
[inp]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#instance_properties
[wcag 2.2]: https://www.w3.org/TR/WCAG22/
[wcag:info-rel]: https://www.w3.org/TR/WCAG22/#info-and-relationships
[wcag:error-id]: https://www.w3.org/TR/WCAG22/#error-identification
[wcag:error-hint]: https://www.w3.org/TR/WCAG22/#error-suggestion
