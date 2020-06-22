const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const DROPZONE_CLASS = `${PREFIX}-file-input`;
const DROPZONE = `.${DROPZONE_CLASS}`;
const INPUT_CLASS = `${PREFIX}-file-input__input`;
const TARGET_CLASS = `${PREFIX}-file-input__target`;
const BOX_CLASS = `${PREFIX}-file-input__box`;
const INSTRUCTIONS_CLASS = `${PREFIX}-file-input__instructions`;
const PREVIEW_CLASS = `${PREFIX}-file-input__preview`;
const PREVIEW_HEADING_CLASS = `${PREFIX}-file-input__preview-heading`;
const CHOOSE_CLASS = `${PREFIX}-file-input__choose`;
const ACCEPTED_FILE_MESSAGE_CLASS = `${PREFIX}-file-input__accepted-files-message`;
const DRAG_TEXT_CLASS = `${PREFIX}-file-input__drag-text`;
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
const buildFileInput = fileInputEl => {
  const acceptsMultiple = fileInputEl.hasAttribute('multiple');
  const fileInputParent = document.createElement('div');
  const dropTarget = document.createElement('div');
  const box = document.createElement('div');
  const instructions = document.createElement('div');
  const label = fileInputEl.previousElementSibling;

  fileInputEl.classList.remove(DROPZONE_CLASS);
  fileInputEl.classList.add(INPUT_CLASS);

  fileInputEl.parentNode.insertBefore(dropTarget, fileInputEl);
  fileInputEl.parentNode.insertBefore(fileInputParent, dropTarget);

  dropTarget.appendChild(fileInputEl);
  dropTarget.classList.add(TARGET_CLASS);

  if (label) {
    fileInputParent.appendChild(label);
  }

  fileInputParent.appendChild(dropTarget);
  fileInputParent.classList.add(DROPZONE_CLASS);

  fileInputEl.parentNode.insertBefore(instructions, fileInputEl);
  fileInputEl.parentNode.insertBefore(box, fileInputEl);
  box.classList.add(BOX_CLASS);
  instructions.classList.add(INSTRUCTIONS_CLASS);
  instructions.setAttribute('aria-hidden', 'true');

  if (acceptsMultiple) {
    instructions.innerHTML = `<span class="${DRAG_TEXT_CLASS}">Drag files here or </span><span class="${CHOOSE_CLASS}">choose from folder</span>`;
  }
  else {
    instructions.innerHTML = `<span class="${DRAG_TEXT_CLASS}">Drag file here or </span><span class="${CHOOSE_CLASS}">choose from folder</span>`;
  }

  if ((/rv:11.0/i.test(navigator.userAgent)) || (/Edge\/\d./i.test(navigator.userAgent))) {
    fileInputParent.querySelector(`.${DRAG_TEXT_CLASS}`).outerHTML = "";
  }

  return { instructions, dropTarget };
};


const removeOldPreviews = (dropTarget, instructions) => {
  const filePreviews = dropTarget.querySelectorAll(`.${PREVIEW_CLASS}`);
  const currentPreviewHeading = dropTarget.querySelector(`.${PREVIEW_HEADING_CLASS}`)

  if (currentPreviewHeading) {
    currentPreviewHeading.outerHTML = "";
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

const preventInvalidFiles = (e, fileInputEl, instructions, dropTarget) => {
  const acceptedFiles = fileInputEl.getAttribute('accept');
  dropTarget.classList.remove(INVALID_FILE_CLASS);

  if (acceptedFiles) {
    const errorMessage = document.createElement('div');
    const currentErrorMessage = dropTarget.querySelector(`.${ACCEPTED_FILE_MESSAGE_CLASS}`);

    if (currentErrorMessage) {
      currentErrorMessage.outerHTML = "";
    }

    let filesAllowed = true;
    for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
      const file = e.dataTransfer.files[i];
      if (filesAllowed) {
        filesAllowed = file.name.indexOf(acceptedFiles)
      }
    }
    if (filesAllowed < 0) {
      removeOldPreviews(dropTarget, instructions);
      fileInputEl.value = ''; // eslint-disable-line no-param-reassign
      dropTarget.insertBefore(errorMessage, fileInputEl);
      errorMessage.innerHTML = `Please attach only ${acceptedFiles} files`;
      errorMessage.classList.add(ACCEPTED_FILE_MESSAGE_CLASS);
      dropTarget.classList.add(INVALID_FILE_CLASS);
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

const handleChange = (e, fileInputEl, instructions, dropTarget) => {
  const fileNames = e.target.files;
  const filePreviewsHeading = document.createElement('div');

  removeOldPreviews(dropTarget, instructions);

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
       if (fileName.indexOf(".pdf") > 0) {
         previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${PDF_PREVIEW_CLASS}")`)
       }
       else if ((fileName.indexOf('.doc') > 0) || (fileName.indexOf('.pages') > 0)) {
         previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${WORD_PREVIEW_CLASS}")`)
       }
       else if ((fileName.indexOf('.xls') > 0) || (fileName.indexOf('.numbers') > 0)) {
        previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${EXCEL_PREVIEW_CLASS}")`)
       }
       else if ((fileName.indexOf('.mov') > 0) || (fileName.indexOf('.mp4') > 0)) {
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
      select(DROPZONE, root).forEach(fileInputEl => {
        const { instructions, dropTarget } = buildFileInput(fileInputEl);

        dropTarget.addEventListener("dragover", function handleDragOver() {
          this.classList.add(DRAG_CLASS);
        }, false);

        dropTarget.addEventListener("dragleave", function handleDragLeave() {
          this.classList.remove(DRAG_CLASS);
        }, false);

        dropTarget.addEventListener("drop", function handleDrop(e) {
          preventInvalidFiles(e, fileInputEl, instructions, dropTarget);
          this.classList.remove(DRAG_CLASS);
        }, false);

        fileInputEl.onchange = e => { // eslint-disable-line no-param-reassign
          handleChange(e, fileInputEl, instructions, dropTarget)
        }
      });
    }
  }
);

module.exports = fileInpt;
