const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const DROPZONE = `.${PREFIX}-file-input`;
const INPUT = `.${PREFIX}-file-input__input`;
const TARGET = `.${PREFIX}-file-input__target`;
const INITIALIZED_CLASS = `${PREFIX}-file-input--is-initialized`;
const INSTRUCTIONS = `.${PREFIX}-file-input__instructions`;
const PREVIEW_CLASS = `${PREFIX}-file-input__preview`;
const PREVIEW_HEADING_CLASS = `${PREFIX}-file-input__preview-heading`;
const ACCEPTED_FILE_MESSAGE_CLASS = `${PREFIX}-file-input__accepted-files-message`;
const DRAG_CLASS = `${PREFIX}-file-input--drag`;
const LOADING_CLASS = 'is-loading';
const HIDDEN_CLASS = 'display-none';
const INVALID_FILE_CLASS = 'has-invalid-file';
const GENERIC_PREVIEW_CLASS_NAME = `${PREFIX}-file-input__preview__image`;
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
 * @param {HTMLinputElement|HTMLTextAreaElement} fileInputParent The character count input element
 * @returns {CharacterCountElements} elements The root and message element.
 */
const getDropzoneElements = fileInputParent => {
  const inputEl = fileInputParent.querySelector(INPUT);
  const instructions = fileInputParent.querySelector(INSTRUCTIONS);
  const dropTarget = fileInputParent.querySelector(TARGET);
  if (!fileInputParent) {
    throw new Error(`${INPUT} is missing outer ${DROPZONE}`);
  }
  return { inputEl, instructions, dropTarget };
};


/**
 * Setup the file input component
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 */
const setupAttributes = fileInputParent => {
  fileInputParent.classList.add(INITIALIZED_CLASS);
};


const removeOldPreviews = (fileInputParent, instructions) => {
  const filePreviews = fileInputParent.querySelectorAll(`.${PREVIEW_CLASS}`);
  const currentPreviewHeading = fileInputParent.querySelector(`.${PREVIEW_HEADING_CLASS}`)

  if (currentPreviewHeading) {
    currentPreviewHeading.remove();
  }
  // Get rid of existing previews if they exist
  if (filePreviews !== null) {
    // Set original instructions
    if (instructions) {
      instructions.classList.remove(HIDDEN_CLASS);
    }
    Array.prototype.forEach.call(filePreviews, function removeImages(node) {
      node.parentNode.removeChild(node);
    });
  }
}

const preventInvalidFiles = (e, inputEl, fileInputParent, instructions, dropTarget) => {
  const acceptedFiles = inputEl.getAttribute('accept');

  fileInputParent.classList.remove(INVALID_FILE_CLASS);

  if (acceptedFiles) {
    const errorMessage = document.createElement('div');
    const currentErrorMessage = fileInputParent.querySelector(`.${ACCEPTED_FILE_MESSAGE_CLASS}`);

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
      removeOldPreviews(fileInputParent, instructions);
      inputEl.value = ''; // eslint-disable-line no-param-reassign
      dropTarget.insertBefore(errorMessage, inputEl);
      errorMessage.innerHTML = `Please attach only ${acceptedFiles} files`;
      errorMessage.classList.add(ACCEPTED_FILE_MESSAGE_CLASS);
      fileInputParent.classList.add(INVALID_FILE_CLASS);
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

const handleChange = (e, inputEl, fileInputParent, instructions, dropTarget) => {
  const fileNames = e.target.files;
  const filePreviewsHeading = document.createElement('div');

  removeOldPreviews(fileInputParent, instructions);

  for (let i = 0; i < fileNames.length; i += 1) {
     const reader = new FileReader();
     const fileName = fileNames[i].name;

     reader.onloadstart = function createFilePreview() {
       const imageId = makeSafeForID(fileName);
       const previewImage = `<img id="${imageId}" src="${SPACER_GIF}" alt="" class="usa-file-input__preview__image  ${LOADING_CLASS}"/>`;

       instructions.insertAdjacentHTML('afterend', `<div class="${PREVIEW_CLASS}" aria-hidden="true">${previewImage}${fileName}<div>`);
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
       dropTarget.insertBefore(filePreviewsHeading, instructions);
       filePreviewsHeading.innerHTML = `Selected file <span class="usa-file-input__choose">Replace?</span>`;
     }
     else if (i >= 1) {
       dropTarget.insertBefore(filePreviewsHeading, instructions);
       filePreviewsHeading.innerHTML = `${i + 1} files selected <span class="usa-file-input__choose">Replace?</span>`;
     }

     if (filePreviewsHeading) {
       instructions.classList.add(HIDDEN_CLASS);
       filePreviewsHeading.classList.add(PREVIEW_HEADING_CLASS);
     }
   }
}

const fileInpt = behavior(
  {
  },
  {
    init(root) {
      select(DROPZONE, root).forEach(fileInputParent => {
        const { inputEl, instructions, dropTarget } = getDropzoneElements(fileInputParent);
        setupAttributes(fileInputParent);

        fileInputParent.addEventListener("dragover", function handleDragOver() {
          this.classList.add(DRAG_CLASS);
        }, false);

        fileInputParent.addEventListener("dragleave", function handleDragLeave() {
          this.classList.remove(DRAG_CLASS);
        }, false);

        fileInputParent.addEventListener("drop", function handleDrop(e) {
          preventInvalidFiles(e, inputEl, fileInputParent, instructions, dropTarget);
          this.classList.remove(DRAG_CLASS);
        }, false);

        inputEl.onchange = e => {
          handleChange(e, inputEl, fileInputParent, instructions, dropTarget)
        }
      });
    }
  }
);

module.exports = fileInpt;
