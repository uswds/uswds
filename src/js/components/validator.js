var $ = require( 'jquery' );

module.exports = function ($el) {
  var data = $('#password[data-validation-element]').data(),
      key,
      validatorName,
      validatorPattern,
      $validatorCheckbox,
      $checkList = $($el.data('validationElement'));

  function validate() {
    for (key in data) {
      if (key.startsWith('validate')) {
        validatorName = key.split('validate')[1];
        validatorPattern = new RegExp(data[key]);
        $validatorCheckbox = $checkList.find('[data-validator=' +
            validatorName.toLowerCase() + ']');

        if (!validatorPattern.test($el.val())) {
          $validatorCheckbox.toggleClass('usa-checklist-checked', false);
        }
        else {
          $validatorCheckbox.toggleClass('usa-checklist-checked', true);
        }
      }
    }
  }

  $el.on('keyup', validate);
};

