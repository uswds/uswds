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
const DRAG_CLASS = `${PREFIX}-dropzone--drag`;
const LOADING_CLASS = 'is-loading';
const HIDDEN_CLASS = 'display-none';
const GENERIC_PREVIEW_CLASS = `${PREFIX}-dropzone__preview__image--generic`;
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


/**
 * Handle changes
 *
 * @param {HTMLinputElement|HTMLTextAreaElement} inputEl The character count input element
 */

const handleChange = (e, inputEl, dropzoneEl, dropzoneInstructions, dropzoneTarget) => {
  const fileNames = e.target.files;
  const filePreviews = dropzoneEl.querySelectorAll(`.${PREVIEW_CLASS}`);
  const filePreviewsHeading = document.createElement('div');
  const currentPreviewHeading = dropzoneEl.querySelector(`.${PREVIEW_HEADING_CLASS}`)

  if (currentPreviewHeading) {
    currentPreviewHeading.remove();
  }

  // Get rid of existing previews if they exist
  if (filePreviews !== null) {
    // Set original instructions
    dropzoneInstructions.classList.remove(HIDDEN_CLASS);
    Array.prototype.forEach.call(filePreviews, function removePreviews(node) {
      node.parentNode.removeChild(node);
    });
  }

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

       previewImage.setAttribute("onerror",`this.onerror=null;this.src="${SPACER_GIF}"; this.classList.add("${GENERIC_PREVIEW_CLASS}")`)
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

        dropzoneEl.addEventListener("drop", function handleDrop() {
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
