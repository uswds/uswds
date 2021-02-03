const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const TABLE = `.${PREFIX}-table`;
const SORTED = "aria-sort";
const ASCENDING = "ascending";
const DESCENDING = "descending";
const SORT_OVERRIDE = "data-sort-value";
const ICON_PATH = "../../dist/img/sprite.svg";
const ICON_UNSORTED = `${ICON_PATH}#swap_vert`;
const ICON_ASCENDING = `${ICON_PATH}#arrow_upward`;
const ICON_DESCENDING = `${ICON_PATH}#arrow_downward`;

const BUTTON_CLASS = `${PREFIX}-table__header__button`;
const BUTTON = `.${BUTTON_CLASS}`;
const HEADER = `.${PREFIX}-table__header--sortable`;
const ANNOUNCEMENT_REGION = `.${PREFIX}-table__announcement-region[aria-live="polite"]`;

/** Gets the data-sort-value attribute value, if provided — otherwise, gets
 * the innerText or textContent — of the child element (HTMLTableCellElement) 
 * at the specified index of the given table row
 * 
 * @param {number} index
 * @param {array<HTMLTableRowElement>} tr
 * @return {boolean} 
 */
const getCellValue = (tr, index) => tr.children[index].getAttribute(SORT_OVERRIDE) 
                                  || tr.children[index].innerText 
                                  || tr.children[index].textContent;

/**
 * Compares the values of two row array items at the given index, then sorts by the given direction
 * @param {number} index
 * @param {string} direction
 * @return {boloean} 
 */
const compareFunction = (index, direction) => (a, b) => ((v1, v2) => 
    // if neither value is empty, and if both values are already numbers, compare numerically. Otherwise, compare alphabetically based on current user locale
    v1 !== '' && v2 !== '' && !Number.isNaN(Number(v1)) && !Number.isNaN(Number(v2)) ? v1 - v2 : v1.toString().localeCompare(v2, navigator.languages[0] || navigator.language, {numeric: true, ignorePunctuation: true})
    )(getCellValue(direction ? a : b, index), getCellValue(direction ? b : a, index));

/**
 * Get an Array of column headers elements belonging directly to the given
 * table element.
 * @param {HTMLTableElement} table
 * @return {array<HTMLTableHeaderCellElement>}
 */
const getColumnHeaders = (table) => {
  const headers = select(HEADER, table);
  return headers.filter((header) => header.closest(TABLE) === table);
};

/**
 * Update the button label within the given header element, resetting it
 * to the default state (ready to sort ascending) if it's no longer sorted
 * @param {HTMLTableHeaderCellElement} header
 */
const updateSortLabel = (header) => {
  const headerName = header.innerText;
  const sortedAscending = header.getAttribute(SORTED) === ASCENDING;
  const isSorted = header.getAttribute(SORTED) === ASCENDING || header.getAttribute(SORTED) === DESCENDING || false;
  const headerLabel = `${headerName}', sortable column, currently ${isSorted ? `${sortedAscending ? `sorted ${ASCENDING}` : `sorted ${DESCENDING}`}`: 'unsorted'}`;
  const headerButtonLabel = `Sort by ${headerName} in ${sortedAscending ? DESCENDING : ASCENDING} order.`;
  header.setAttribute("aria-label", headerLabel);
  header.querySelector(BUTTON).setAttribute("aria-label", headerButtonLabel);
}

/**
 * Remove the aria-sort attribute on the given header element, and reset the label and button icon
 * @param {HTMLTableHeaderCellElement} header
 */
const unsetSort = (header) => {
  header.removeAttribute(SORTED);
  updateButtonIcon(header.querySelector(BUTTON))
  updateSortLabel(header);
}

/**
 * Sort rows either ascending or descending, based on a given header's aria-sort attribute
 * @param {HTMLTableHeaderCellElement} header
 * @param {boolean} ascending
 * @return {boolean} true
 */
const sortRows = (header, ascending) => {
  header.setAttribute(SORTED, ascending === true ? DESCENDING : ASCENDING );
  updateButtonIcon(header.querySelector(BUTTON), ascending === true ? DESCENDING : ASCENDING);
  updateSortLabel(header);

  const tbody = header.closest(TABLE).querySelector('tbody');
  Array.from(tbody.querySelectorAll('tr'))
    .sort(compareFunction(Array.from(header.parentNode.children).indexOf(header), !ascending))
    .forEach(tr => tbody.appendChild(tr) );
  return true;
}

/**
 * Toggle a header's sort state, optionally providing a target
 * state.
 *
 * @param {HTMLTableHeaderCellElement} header
 * @param {boolean?} ascending If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 */
const toggleSort = (header, ascending) => {
  const table = header.closest(TABLE);
  let safeAscending = ascending;
  if (typeof safeAscending !== "boolean") {
    safeAscending = header.getAttribute(SORTED) === ASCENDING;
  }
  
  if (!table) {
    throw new Error(`${HEADER} is missing outer ${TABLE}`);
  }

  safeAscending = sortRows(header, ascending);

  if (safeAscending) {
    getColumnHeaders(table).forEach((otherHeader) => {
      if (otherHeader !== header) {
        unsetSort(otherHeader);
      }
    });
    updateLiveRegion(table, header);
  }
};

/**
 ** Inserts a button with icon inside a sortable header
 * @param {HTMLTableHeaderCellElement} header
 */

const createHeaderButton = (header) => {
  const buttonEl = document.createElement("button");
  buttonEl.setAttribute('tabindex', '0');
  buttonEl.classList.add(BUTTON_CLASS);
  buttonEl.innerHTML = `
    <svg class="usa-icon usa-icon--size-3" aria-hidden="true" role="img">
      <use href="${ICON_UNSORTED}"></use>
    </svg>
  `;
  header.appendChild(buttonEl);
  updateSortLabel(header);
}

/**
 ** Updates button icon path to display a sort direction, if provided.
 * Otherwise, show the unsorted icon.
 * @param {HTMLButtonElement} button
 * @param {String} sortDirection optional
 */

const updateButtonIcon = (button, sortDirection = "") => {
  let icon = ICON_UNSORTED;
  if (sortDirection === ASCENDING) icon = ICON_ASCENDING;
  if (sortDirection === DESCENDING) icon = ICON_DESCENDING;
  button.querySelector(".usa-icon use").setAttribute("href", icon);
}


/**
 * Update the live region immediately following the table whenever sort changes.
 * @param {HTMLTableElement} table
 * @param {HTMLTableHeaderCellElement} sortedHeader
 */

const updateLiveRegion = (table, sortedHeader) => {
  const caption = table.querySelector('caption').innerText;
  const sortedAscending = sortedHeader.getAttribute(SORTED) === ASCENDING;
  const headerLabel = sortedHeader.innerText;
  const liveRegion = table.nextElementSibling;
  if (liveRegion && liveRegion.matches(ANNOUNCEMENT_REGION)) {
    var sortAnnouncement = `The table named "${caption}" is now sorted by ${headerLabel} in ${sortedAscending ? ASCENDING : DESCENDING } order.`;
    liveRegion.innerText = sortAnnouncement;  
  } else {
    throw new Error(`Table containing a sortable column header is not followed by an aria-live region.`)
  }
}
 


const table = behavior(
  {
    [CLICK]: {
      [BUTTON](event) {
        event.preventDefault();
        toggleSort(
          event.target.closest(HEADER), 
          event.target.closest(HEADER).getAttribute(SORTED) === ASCENDING
        ); 
      },
    },
  },
  {
    init(root) {
      const sortableHeaders = select(HEADER, root);
      sortableHeaders.forEach((header) => createHeaderButton(header));

      const firstSorted = sortableHeaders.find((header) => header.getAttribute(SORTED) === ASCENDING || header.getAttribute(SORTED) === DESCENDING);
      if (typeof firstSorted === "undefined") {
        // no sortable headers found
        return;
      }   
      const sortDir = firstSorted.getAttribute(SORTED);
      if (sortDir === ASCENDING) {
        toggleSort(firstSorted, true);
        return;
      }
      else if (sortDir === DESCENDING) {
        toggleSort(firstSorted, false);
      }
    },
    TABLE,
    HEADER,
    BUTTON
  }
);

module.exports = table;
