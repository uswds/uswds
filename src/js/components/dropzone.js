const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const DROPZONE = `.${PREFIX}-dropzone`;
const INPUT = `.${PREFIX}-dropzone__input`;
const INITIALIZED_CLASS = `${PREFIX}-dropzone--is-initialized`;
const PREVIEW_CLASS = 'usa-dropzone__preview';


/**
 * Returns the root and message element
 * for an character count input
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 * @returns {CharacterCountElements} elements The root and message element.
 */


const getinputElements = inputEl => {
  const dropzoneEl = inputEl.closest(DROPZONE);
  if (!dropzoneEl) {
    throw new Error(`${INPUT} is missing outer ${DROPZONE}`);
  }

  return { dropzoneEl };
};


/**
 * Setup the dropzone component
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 */
const setupAttributes = inputEl => {
  const { dropzoneEl } = getinputElements(inputEl);

  dropzoneEl.classList.add(INITIALIZED_CLASS);
};


/**
 * Handle changes
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 */

const handleChange = inputEl => {
  const { dropzoneEl } = getinputElements(inputEl);

  inputEl.onchange = e => {
    const fileNames = e.target.files;
    const filePreviews = dropzoneEl.querySelectorAll('.'+ PREVIEW_CLASS);

    // Get rid of existing previews if they exist
    if (filePreviews !== null){
      Array.prototype.forEach.call( filePreviews, function( node ) {
        node.parentNode.removeChild( node );
      });
    }

    for (var i = 0; i < fileNames.length; i++)
    {
     const reader  = new FileReader();

     reader.onloadend = function() {
       dropzoneEl.insertAdjacentHTML('beforeend', '<div class="' + PREVIEW_CLASS +  '" aria-hidden="true"><img src="' + reader.result + '" alt="" class="usa-dropzone__preview__image"/>'+the_file_name+'<div>');
     }

     if (fileNames[i]) {
        reader.readAsDataURL(fileNames[i]);
     }
     else {
       preview.src = "";
     }

     const the_file_name = fileNames[i].name;

    }
  }
}

const dropzone = behavior(
  {
    input: {
      [INPUT]() {
        handleChange(this);
      }
    }
  },
  {
    init(root) {
      select(DROPZONE, root).forEach(input => {
        setupAttributes(input);
        //updateCountMessage(input);
      });
    },
    //MESSAGE_INVALID_CLASS,
    //VALIDATION_MESSAGE
  }
);

module.exports = dropzone;
