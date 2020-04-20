const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const DROPZONE = `.${PREFIX}-dropzone`;
const INPUT = `.${PREFIX}-dropzone__input`;
const INITIALIZED_CLASS = `${PREFIX}-dropzone--is-initialized`;
const PREVIEW_CLASS = 'usa-dropzone__preview';
const DRAG_CLASS = 'usa-dropzone--drag'


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

  var support = (function () {
    if (!window.DOMParser) return false;
    var parser = new DOMParser();
    try {
      parser.parseFromString('x', 'text/html');
    } catch(err) {
      return false;
    }
    return true;
  })();



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
       console.log(inputEl.id);

       let the_id = the_file_name.replace(" ", "_");

       const preview_image = '<img id="'+ the_id +'" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" class="usa-dropzone__preview__image usa-dropzone__preview__image--blank"/>';

       dropzoneEl.insertAdjacentHTML('beforeend', '<div class="' + PREVIEW_CLASS +  '" aria-hidden="true">'+ preview_image + the_file_name+'<div>');

     }

     reader.onloadend = function() {
       console.log(inputEl.id);

       let the_id = the_file_name.replace(" ", "_");

       let preview_image = document.getElementById(the_id);
       console.log(preview_image);

       preview_image.classList.remove('usa-dropzone__preview__image--blank');
       preview_image.src = reader.result;

       //let new_preview_image = dropzoneEl.querySelectorAll(PREVIEW_CLASS + " .usa-dropzone__preview__image");

       //dropzoneEl.insertAdjacentHTML('beforeend', '<div class="' + PREVIEW_CLASS +  '" aria-hidden="true"><img src="' + reader.result + '" alt="" class="usa-dropzone__preview__image"/>'+the_file_name+'<div>');



       //preview_image[0].remove();

       //console.log(preview_image[0].getAttribute("src"));


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
        handleChange(this);
      }
    }
  },
  {
    init(root) {
      select(DROPZONE, root).forEach(input => {
        setupAttributes(input);
      });
    }
  }
);

module.exports = dropzone;
