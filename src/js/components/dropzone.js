const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const DROPZONE = `.${PREFIX}-dropzone`;
const INPUT = `.${PREFIX}-dropzone__input`;
const TARGET = `.${PREFIX}-dropzone__target`;
const INITIALIZED_CLASS = `${PREFIX}-dropzone--is-initialized`;
const INSTRUCTIONS = `.${PREFIX}-dropzone__instructions`;
const PREVIEW_CLASS = `${PREFIX}-dropzone__preview`;
const PREVIEW_HEADING_CLASS = `${PREFIX}-dropzone__preview-heading`;
const ACCEPTED_FILE_MESSAGE_CLASS = `${PREFIX}-dropzone__accepted-files-message`;
const DRAG_CLASS = `${PREFIX}-dropzone--drag`;
const LOADING_CLASS = 'is-loading';
const HIDDEN_CLASS = 'display-none';
const INVALID_FILE_CLASS = 'has-invalid-file';
const GENERIC_PREVIEW_CLASS_NAME = `${PREFIX}-dropzone__preview__image`;
const GENERIC_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--generic`;
const PDF_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--pdf`;
const WORD_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--word`;
const VIDEO_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--video`;
const EXCEL_PREVIEW_CLASS = `${GENERIC_PREVIEW_CLASS_NAME}--excel`;
const SPACER_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';


/**
 * Takes file name of file(s) selected and creates
 * safe ID name, stripping invalid characters
 *
 * @param {String} name - The file name selected
 * @returns {String} - ID with only valid characters
 */
const makeSafeForID = name => {
  return name.replace(/[^a-z0-9]/g, function replaceName(s) {
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
 * @param {HTMLinputElement|HTMLTextAreaElement} dropzoneEl The character count input element
 * @returns {CharacterCountElements} elements The root and message element.
 */
const getDropzoneElements = dropzoneEl => {
  const inputEl = dropzoneEl.querySelector(INPUT);
  const dropzoneInstructions = dropzoneEl.querySelector(INSTRUCTIONS);
  const dropzoneTarget = dropzoneEl.querySelector(TARGET);
  if (!dropzoneEl) {
    throw new Error(`${INPUT} is missing outer ${DROPZONE}`);
  }
  return { inputEl, dropzoneInstructions, dropzoneTarget };
};


/**
 * Setup the dropzone component
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 */
const setupAttributes = dropzoneEl => {
  dropzoneEl.classList.add(INITIALIZED_CLASS);
};


const removeOldPreviews = (dropzoneEl, dropzoneInstructions) => {
  const filePreviews = dropzoneEl.querySelectorAll(`.${PREVIEW_CLASS}`);
  const currentPreviewHeading = dropzoneEl.querySelector(`.${PREVIEW_HEADING_CLASS}`)

  if (currentPreviewHeading) {
    currentPreviewHeading.remove();
  }
  // Get rid of existing previews if they exist
  if (filePreviews !== null) {
    // Set original instructions
    if (dropzoneInstructions) {
      dropzoneInstructions.classList.remove(HIDDEN_CLASS);
    }
    Array.prototype.forEach.call(filePreviews, function removeImages(node) {
      node.parentNode.removeChild(node);
    });
  }
}

const preventInvalidFiles = (e, inputEl, dropzoneEl, dropzoneInstructions, dropzoneTarget) => {
  const acceptedFiles = inputEl.getAttribute('accept');

  dropzoneEl.classList.remove(INVALID_FILE_CLASS);
  
  if (acceptedFiles) {
    const errorMessage = document.createElement('div');
    const currentErrorMessage = dropzoneEl.querySelector(`.${ACCEPTED_FILE_MESSAGE_CLASS}`);

    if (currentErrorMessage) {
      currentErrorMessage.remove();
    }

    let filesAllowed = true;
    for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
      const file = e.dataTransfer.files[i];
      if (filesAllowed) {
        filesAllowed = file.name.includes(acceptedFiles)
      }
    }
    if (!filesAllowed) {
      removeOldPreviews(dropzoneEl, dropzoneInstructions);
      inputEl.value = ''; // eslint-disable-line no-param-reassign
      dropzoneTarget.insertBefore(errorMessage, inputEl);
      errorMessage.innerHTML = `Please attach only ${acceptedFiles} files`;
      errorMessage.classList.add(ACCEPTED_FILE_MESSAGE_CLASS);
      dropzoneEl.classList.add(INVALID_FILE_CLASS);
      e.preventDefault();
      e.stopPropagation();
    }
  }
}


/**
 * Handle changes
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 */

const handleChange = (e, inputEl, dropzoneEl, dropzoneInstructions, dropzoneTarget) => {
  const fileNames = e.target.files;
  const filePreviewsHeading = document.createElement('div');

  removeOldPreviews(dropzoneEl, dropzoneInstructions);

  for (let i = 0; i < fileNames.length; i += 1) {
     const reader = new FileReader();
     const fileName = fileNames[i].name;

     reader.onloadstart = function createFilePreview() {
       const imageId = makeSafeForID(fileName);
       const previewImage = `<img id="${imageId}" src="${SPACER_GIF}" alt="" class="usa-dropzone__preview__image  ${LOADING_CLASS}"/>`;

       dropzoneInstructions.insertAdjacentHTML('afterend', `<div class="${PREVIEW_CLASS}" aria-hidden="true">${previewImage}${fileName}<div>`);
     }

     reader.onloadend = function createGenericFilePreview() {
       const imageId = makeSafeForID(fileName);
       const previewImage = document.getElementById(imageId);
       if (fileName.includes(".pdf")) {
         previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${PDF_PREVIEW_CLASS}")`)
       }
       else if ((fileName.includes('.doc')) || (fileName.includes('.pages'))) {
         previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${WORD_PREVIEW_CLASS}")`)
       }
       else if ((fileName.includes('.xls')) || (fileName.includes('.numbers'))) {
        previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${EXCEL_PREVIEW_CLASS}")`)
       }
       else if ((fileName.includes('.mov')) || (fileName.includes('.mp4'))) {
        previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${VIDEO_PREVIEW_CLASS}")`)
       }
       else {
         previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${GENERIC_PREVIEW_CLASS}")`)
       }
       previewImage.classList.remove(LOADING_CLASS);
       previewImage.src = reader.result;
     }

     if (fileNames[i]) {
        reader.readAsDataURL(fileNames[i]);
     }

     if (i === 0) {
       dropzoneTarget.insertBefore(filePreviewsHeading, dropzoneInstructions);
       filePreviewsHeading.innerHTML = `Selected file <span class="usa-dropzone__choose">Replace?</span>`;
     }
     else if (i >= 1) {
       dropzoneTarget.insertBefore(filePreviewsHeading, dropzoneInstructions);
       filePreviewsHeading.innerHTML = `${i + 1} files selected <span class="usa-dropzone__choose">Replace?</span>`;
     }

     if (filePreviewsHeading) {
       dropzoneInstructions.classList.add(HIDDEN_CLASS);
       filePreviewsHeading.classList.add(PREVIEW_HEADING_CLASS);
     }
   }
}

const dropzone = behavior(
  {
  },
  {
    init(root) {
      select(DROPZONE, root).forEach(dropzoneEl => {
        const { inputEl, dropzoneInstructions, dropzoneTarget } = getDropzoneElements(dropzoneEl);
        setupAttributes(dropzoneEl);

        dropzoneEl.addEventListener("dragover", function handleDragOver() {
          this.classList.add(DRAG_CLASS);
        }, false);

        dropzoneEl.addEventListener("dragleave", function handleDragLeave() {
          this.classList.remove(DRAG_CLASS);
        }, false);

        dropzoneEl.addEventListener("drop", function handleDrop(e) {
          preventInvalidFiles(e, inputEl, dropzoneEl, dropzoneInstructions, dropzoneTarget);
          this.classList.remove(DRAG_CLASS);
        }, false);

        inputEl.onchange = e => {
          handleChange(e, inputEl, dropzoneEl, dropzoneInstructions,dropzoneTarget)
        }
      });
    }
  }
);

module.exports = dropzone;
