const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const TABLE = `.${PREFIX}-table--sortable`;
const SORTABLE = "aria-sort";

const BUTTON = `.${PREFIX}-table__header--sortable[${SORTABLE}] > button`;
const HEADER = `.${PREFIX}-table__header--sortable[${SORTABLE}]`;


const getCellValue = (tr, index) => tr.children[index].innerText || tr.children[index].textContent;


// only sorts strings alphabetically, doesn't yet compare floats
const compareFunction = (index, direction) => (a, b) => ((v1, v2) => 
    // if neither value is empty, and if both values are already numbers, compare numerically. Otherwise, compare alphabetically based on current user locale
    v1 !== '' && v2 !== '' && !Number.isNaN(Number(v1)) && !Number.isNaN(Number(v2)) ? v1 - v2 : v1.toString().localeCompare(v2, navigator.languages[0] || navigator.language, {numeric: true, ignorePunctuation: true})
    )(getCellValue(direction ? a : b, index), getCellValue(direction ? b : a, index));

/**
 * Get an Array of column headers elements belonging directly to the given
 * table element.
 * @param {HTMLElement} table
 * @return {array<HTMLTableHeaderCellElement>}
 */
const getColumnHeaders = (table) => {
  const headers = select(HEADER, table);
  return headers.filter((header) => header.closest(TABLE) === table);
};

const updateSortLabel = (header) => {
  const headerName = header.querySelector(BUTTON).innerText;
  const headerIsAscending = header.getAttribute(SORTABLE) === "ascending";

  const headerLabel = `Sort by ${headerName} in ${headerIsAscending ? 'descending' : 'ascending'} order`;
  header.querySelector(BUTTON).setAttribute("aria-label", headerLabel);
}

const unsetSort = (header) => {
  header.setAttribute(SORTABLE, "none");
  updateSortLabel(header);
}

const sortRows = (header, ascending) => {
  header.setAttribute(SORTABLE, ascending === true ? "descending" : "ascending");
  updateSortLabel(header);

  const tbody = header.closest(TABLE).querySelector('tbody');
  Array.from(tbody.querySelectorAll('tr'))
    .sort(compareFunction(Array.from(header.parentNode.children).indexOf(header), !ascending))
    .forEach(tr => tbody.appendChild(tr) );


  // TODO: handle errors here 
  return true;
}


/**
 * Toggle a header's sort state, optionally providing a target
 * state.
 *
 * @param {HTMLTableHeaderCellElement} header
 * @param {boolean?} ascending If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
const toggleSort = (header, ascending) => {
  const table = header.closest(TABLE);
  let safeAscending = ascending;

  if (typeof safeAscending !== "boolean") {
    safeAscending = header.getAttribute(SORTABLE) === "ascending";
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
  }
};


const table = behavior(
  {
    [CLICK]: {
      [HEADER](event) {
        event.preventDefault();
        toggleSort(
          event.target.parentNode, 
          event.target.parentNode.getAttribute(SORTABLE) === "ascending"); 
          // TODO event is on the button for now, come back to this
      },
    },
  },
  {
    init(root) {
      const sortableHeaders = select(HEADER, root);
      let firstSortable = sortableHeaders.find((header) => header.getAttribute(SORTABLE) === "ascending" || header.getAttribute(SORTABLE) === "descending");
      if (typeof firstSortable === "undefined") {
        // no sortable headers found
        return;
      }   
      const sortDir = firstSortable.getAttribute(SORTABLE);
      if (sortDir === "ascending") {
        toggleSort(firstSortable, true);
        return;
      }
      else if (sortDir === "descending") {
        toggleSort(firstSortable, false);
        return;
      }
    },
    TABLE,
    HEADER,
    BUTTON
  }
);

module.exports = table;
