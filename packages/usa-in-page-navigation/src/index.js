// const behavior = require("../../uswds-core/src/js/utils/behavior");
const Sanitizer = require("../../uswds-core/src/js/utils/sanitizer");

function ready(fn) {
  document.addEventListener("DOMContentLoaded", fn, false);
}

ready(() => {
  const headings = document.querySelectorAll(
    "#main-content h2, #main-content h3"
  );
  const motionQuery = window.matchMedia("(prefers-reduced-motion)");

  const InPageNavigation = {
    container: document.querySelector(".in-page-navigation"),
    links: null,
    headings: null,
    headerOffset: 140,
    intersectionOptions: {
      root: null,
      rootMargin: "0px",
      threshold: 1,
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
      let inPageNavUl = "";
      if (headings && this.container) {
        let inPageNavigationInner = "";
        headings.forEach((heading, i) => {
          const theHeading = heading;
          const tag = heading.tagName.toLowerCase();

          inPageNavigationInner += `<li class="usa-in-page-navigation__item${
            tag === "h3" ? " sub-item" : ""
          }"><a href="#section_${i}">${heading.textContent}</a></li>`;

          const originalHeadingContent = heading.innerText;
          theHeading.innerHTML = Sanitizer.escapeHTML`<a class="offset-anchor" id="section_${i}"></a>${originalHeadingContent}`;
        });

        const inPageNavDiv = document.querySelector("#in-page-navigation");
        inPageNavUl += Sanitizer.escapeHTML`<ul class="usa-in-page-navigation">${inPageNavigationInner}</ul>`;
        console.log("inPageNavUl", inPageNavUl);
        inPageNavDiv.appendChild(inPageNavUl);

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

      if (this.container.classList.contains("usa-current")) {
        this.container.classList.remove("usa-current");
      }
    },

    handleObserver(entries) {
      entries.forEach((entry) => {
        const href = `#${entry.target.getAttribute("id")}`;
        const link = this.links.find((l) => l.getAttribute("href") === href);

        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
          link.classList.add("is-visible");
          this.previousSection = entry.target.getAttribute("id");
        } else {
          link.classList.remove("is-visible");
        }

        this.highlightFirstActive();
      });
    },

    highlightFirstActive() {
      const firstVisibleLink = this.container.querySelector(".is-visible");

      this.links.forEach((link) => {
        link.classList.remove("usa-current");
      });

      if (firstVisibleLink) {
        firstVisibleLink.classList.add("usa-current");
      }

      if (!firstVisibleLink && this.previousSection) {
        this.container
          .querySelector(`a[href="#${this.previousSection}"]`)
          .classList.add("usa-current");
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
