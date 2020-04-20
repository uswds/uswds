const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const DROPZONE = `.${PREFIX}-dropzone`;
const INPUT = `.${PREFIX}-dropzone__input`;
const INITIALIZED_CLASS = `${PREFIX}-dropzone--is-initialized`;
const PREVIEW_CLASS = 'usa-dropzone__preview';
const DRAG_CLASS = 'usa-dropzone--drag';
const LOADING_CLASS = 'usa-dropzone__preview__image--loading';
const GENERIC_PREVIEW_CLASS = 'usa-dropzone__preview__image--generic';
const SPACER_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';


const makeSafeForID = name => {
    return name.replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
        return '__' + ('000' + c.toString(16)).slice(-4);
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

     reader.onloadstart = function() {

       const image_id = makeSafeForID(the_file_name);

       const preview_image = '<img id="'+ image_id +'" src="' + SPACER_GIF + '" alt=" " class="usa-dropzone__preview__image ' + LOADING_CLASS + '"/>';

       dropzoneEl.insertAdjacentHTML('beforeend', '<div class="' + PREVIEW_CLASS +  '" aria-hidden="true">'+ preview_image + the_file_name+'<div>');

     }

     reader.onloadend = function() {

       const image_id = makeSafeForID(the_file_name);

       const preview_image = document.getElementById(image_id);

       preview_image.setAttribute("onerror",'this.onerror=null;this.src="'+ SPACER_GIF +'"; this.classList.add("' + GENERIC_PREVIEW_CLASS + '")')

       preview_image.classList.remove(LOADING_CLASS);
       preview_image.src = reader.result;

     }

     const the_file_name = fileNames[i].name;

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
        //handleChange(this);
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
