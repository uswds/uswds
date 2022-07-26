// const behavior = require("../../uswds-core/src/js/utils/behavior");
const Sanitizer = require("../../uswds-core/src/js/utils/sanitizer");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const MAINCONTENT = "main-content";
const HEADER_OFF_SET_PADDING = 10;
const IO_ROOT_MARGIN = "0px";
const IO_THRESHOLD = 1;
const IN_PAGE_NAV_CLASS = `in-page-navigation`;

const MAINCONTENT_CLASS = `.${MAINCONTENT}`;
const CURRENT_CLASS = `${PREFIX}-current`;
const USA_IN_PAGE_NAV_CLASS = `${PREFIX}-${IN_PAGE_NAV_CLASS}`;
const IN_PAGE_NAV = `.${IN_PAGE_NAV_CLASS}`;
const VISIBLE_CLASS = "is-visible";
const VISIBLE = `.${VISIBLE_CLASS}`;
const OFFSET_ANCHOR = "offset-anchor";
const SUB_ITEM = "sub-item";

function ready(fn) {
  document.addEventListener("DOMContentLoaded", fn, false);
}

ready(() => {
  const HEADER_OFF_SET =
    document.getElementById(`${MAINCONTENT}`).getBoundingClientRect().top +
    window.scrollY;
  console.log("HEADER_OFF_SET", HEADER_OFF_SET);
  console.log(
    "HEADER_OFF_SET - HEADER_OFF_SET_PADDING",
    HEADER_OFF_SET - HEADER_OFF_SET_PADDING
  );
  const headings = document.querySelectorAll(
    `${MAINCONTENT_CLASS} h2, ${MAINCONTENT_CLASS} h3`
  );
  const motionQuery = window.matchMedia("(prefers-reduced-motion)");

  const InPageNavigation = {
    container: document.querySelector(`${IN_PAGE_NAV}`),
    links: null,
    headings: null,
    headerOffset: HEADER_OFF_SET - HEADER_OFF_SET_PADDING,
    intersectionOptions: {
      root: null,
      rootMargin: IO_ROOT_MARGIN,
      threshold: IO_THRESHOLD,
    },

    previousSection: null,
    observer: null,

    init() {
      this.createInPageNav();
      this.handleObserver = this.handleObserver.bind(this);
      this.setUpObserver();
      this.findLinksAndHeadings();
      this.observeSections();

      if (this.links) {
        this.links.forEach((link) => {
          link.addEventListener("click", this.handleLinkClick.bind(this));
        });
      }
    },

    createInPageNav() {
      if (headings && this.container) {
        let inPageNavigationInner = "";

        headings.forEach((heading, i) => {
          const theHeading = heading;
          const tag = heading.tagName.toLowerCase();

          inPageNavigationInner += Sanitizer.escapeHTML`<li class="${USA_IN_PAGE_NAV_CLASS}__item${
            tag === "h3" ? ` ${SUB_ITEM}` : ""
          }"><a href="#section_${i + 1}">${heading.textContent}</a></li>`;

          const originalHeadingContent = heading.innerText;
          theHeading.innerHTML = Sanitizer.escapeHTML`<a class="${OFFSET_ANCHOR}" id="section_${
            i + 1
          }"></a>
          ${originalHeadingContent}`;
        });

        const inPageNavDiv = document.querySelector(`#${IN_PAGE_NAV_CLASS}`);

        const inPageNavUl = document.createElement("ul");
        inPageNavUl.setAttribute("class", `${USA_IN_PAGE_NAV_CLASS}`);
        inPageNavDiv.insertAdjacentElement("beforeend", inPageNavUl);
        inPageNavUl.insertAdjacentHTML("beforeend", inPageNavigationInner);

        if (window.location.hash) {
          const target = window.location.hash;
          const offsetY = document.querySelector(target).offsetTop;
          window.scrollTo(0, offsetY);
        }
      }
    },

    handleLinkClick(event) {
      event.preventDefault();
      const id = event.target.hash.replace("#", "");

      const section = this.headings.find(
        (heading) => heading.getAttribute("id") === id
      );

      section.setAttribute("tabindex", -1);
      section.focus();

      window.scroll({
        behavior: motionQuery.matches ? "instant" : "smooth",
        top: section.offsetTop + this.headerOffset,
        block: "start",
      });

      if (this.container.classList.contains(`${CURRENT_CLASS}`)) {
        this.container.classList.remove(`${CURRENT_CLASS}`);
      }
    },

    handleObserver(entries) {
      entries.forEach((entry) => {
        const href = `#${entry.target.getAttribute("id")}`;
        const link = this.links.find((l) => l.getAttribute("href") === href);

        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
          link.classList.add(`${VISIBLE_CLASS}`);
          this.previousSection = entry.target.getAttribute("id");
        } else {
          link.classList.remove(`${VISIBLE_CLASS}`);
        }

        this.highlightFirstActive();
      });
    },

    highlightFirstActive() {
      const firstVisibleLink = this.container.querySelector(`${VISIBLE}`);

      this.links.forEach((link) => {
        link.classList.remove(`${CURRENT_CLASS}`);
      });

      if (firstVisibleLink) {
        firstVisibleLink.classList.add(`${CURRENT_CLASS}`);
      }

      if (!firstVisibleLink && this.previousSection) {
        this.container
          .querySelector(`a[href="#${this.previousSection}"]`)
          .classList.add(`${CURRENT_CLASS}`);
      }
    },

    observeSections() {
      if (headings && this.container) {
        this.headings.forEach((heading) => this.observer.observe(heading));
      }
    },

    setUpObserver() {
      this.observer = new IntersectionObserver(
        this.handleObserver,
        this.intersectionOptions
      );
    },

    findLinksAndHeadings() {
      if (headings && this.container) {
        this.links = [...this.container.querySelectorAll("a")];
        this.headings = this.links.map((link) => {
          const id = link.getAttribute("href");
          return document.querySelector(id);
        });
      }
    },
  };
  InPageNavigation.init();
});
