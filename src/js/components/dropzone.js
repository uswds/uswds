const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const DROPZONE = `.${PREFIX}-dropzone`;
const INPUT = `.${PREFIX}-dropzone__input`;
const INITIALIZED_CLASS = `${PREFIX}-dropzone--is-initialized`;
const INSTRUCTIONS = `.${PREFIX}-dropzone__instructions`;
const PREVIEW_CLASS = 'usa-dropzone__preview';
const DRAG_CLASS = 'usa-dropzone--drag';
const LOADING_CLASS = 'is-loading';
const GENERIC_PREVIEW_CLASS = 'usa-dropzone__preview__image--generic';
const SPACER_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';


const makeSafeForID = name => {
    return name.replace(/[^a-z0-9]/g, function(s) {
        const c = s.charCodeAt(0);
        if (c === 32) return '-';
        if (c >= 65 && c <= 90) return `img_${s.toLowerCase()}`;
        return `__${("000", c.toString(16)).slice(-4)}`;
    });
}


/**
 * Returns the root and message element
 * for an character count input
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 * @returns {CharacterCountElements} elements The root and message element.
 */


const getinputElements = inputEl => {
  const dropzoneEl = inputEl.closest(DROPZONE);
  const dropzoneInstructions = inputEl.querySelector(INSTRUCTIONS);
  if (!dropzoneEl) {
    throw new Error(`${INPUT} is missing outer ${DROPZONE}`);
  }

  return { dropzoneEl, dropzoneInstructions };
};


/**
 * Setup the dropzone component
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 */
const setupAttributes = inputEl => {
  const { dropzoneEl } = getinputElements(inputEl);

  dropzoneEl.classList.add(INITIALIZED_CLASS);

  inputEl.ondragover = e => {
    dropzoneEl.classList.add(DRAG_CLASS);
  }

  inputEl.ondragleave = e => {
    dropzoneEl.classList.remove(DRAG_CLASS);
  }

  inputEl.ondrop = e => {
    dropzoneEl.classList.remove(DRAG_CLASS);
  }

};


/**
 * Handle changes
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 */

const handleChange = inputEl => {
  const { dropzoneEl, dropzoneInstructions } = getinputElements(inputEl);

  inputEl.onchange = e => {
    const fileNames = e.target.files;
    const filePreviews = dropzoneEl.querySelectorAll(`.${PREVIEW_CLASS}`);

    // Get rid of existing previews if they exist
    if (filePreviews !== null){
      Array.prototype.forEach.call( filePreviews, function( node ) {
        node.parentNode.removeChild( node );
      });
    }

    for (let i = 0; i < fileNames.length; i++)
    {
     const reader  = new FileReader();

     reader.onloadstart = function() {
       const imageId = makeSafeForID(fileName);
       const previewImage = `<img id="${imageId}" src="${SPACER_GIF}" alt="" class="usa-dropzone__preview__image  ${LOADING_CLASS}"/>`;

       dropzoneInstructions.insertAdjacentHTML('afterend', `<div class="${PREVIEW_CLASS}" aria-hidden="true">${previewImage}${fileName}<div>`);

     }

     reader.onloadend = function() {
       const imageId = makeSafeForID(fileName);
       const previewImage = document.getElementById(imageId);

       previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${GENERIC_PREVIEW_CLASS}")`)

       previewImage.classList.remove(LOADING_CLASS);
       previewImage.src = reader.result;

     }

     const fileName = fileNames[i].name;

     if (fileNames[i]) {
        reader.readAsDataURL(fileNames[i]);
     }
     else {
       preview.src = "";
     }

    }
  }
}




const dropzone = behavior(
  {
    input: {
      [INPUT]() {
        // handleChange(this);
      }
    }
  },
  {
    init(root) {
      select(DROPZONE, root).forEach(input => {
        setupAttributes(input);
        handleChange(input);
      });
    }
  }
);

module.exports = dropzone;
