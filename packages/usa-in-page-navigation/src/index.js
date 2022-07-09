function ready(fn) {
  document.addEventListener('DOMContentLoaded', fn, false);
}

ready(() => {
  const headings = document.querySelectorAll('#main-content h2, #main-content h3');
  const motionQuery = window.matchMedia('(prefers-reduced-motion)');

  const InPageNavigation = {
    container: document.querySelector('.in-page-navigation'),
    links: null,
    headings: null,
    intersectionOptions: {
      root: null,
      rootMargin: '0px',
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

      this.links.forEach((link) => {
        link.addEventListener('click', this.handleLinkClick.bind(this));
      }
      );
    },

    createInPageNav() {
      if (headings && headings.length) {
        let inPageNavigationInner = '';
        headings.forEach((heading, i) => {
          let tag = heading.tagName.toLowerCase();

          inPageNavigationInner += `<li class="usa-in-page-navigation__item${tag === 'h3' ? ' padding-left-2' : ''}"><a href="#section_${i}">${heading.textContent}</a></li>`;

          const originalHeadingContent = heading.innerHTML;
          const anchor = `<a class="offset-anchor" id="section_${i}"></a>`;
          heading.innerHTML = anchor + originalHeadingContent;
        }
        );

        const inPageNav = `<ul class="usa-in-page-navigation usa-sidenav">${inPageNavigationInner}</ul>`;
        // add the generated table of content to the dive
        document.querySelector('#in-page-navigation').innerHTML += inPageNav;

        // automatically go to the correct section on load
        if (location.hash) {
          const target = location.hash;
          const offsetY = document.querySelector(target).offsetTop;
          window.scrollTo(0, offsetY);
        }
      }
    },

    handleLinkClick(evt) {
      evt.preventDefault();
      let id = evt.target.hash.replace('#', '');

      let section = this.headings.find((heading) => {
        return heading.getAttribute('id') === id;
      }
      );

      section.setAttribute('tabindex', -1);
      //section.focus();

      window.scroll({
        behavior: motionQuery.matches ? 'instant' : 'smooth',
        top: section.offsetTop + 140,
        block: 'start',
      });

      if (this.container.classList.contains('usa-current')) {
        this.container.classList.remove('usa-current');
      }
    },

    handleObserver(entries, observer) {
      entries.forEach((entry) => {
        let href = `#${entry.target.getAttribute('id')}`
          , link = this.links.find((l) => l.getAttribute('href') === href);

        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
          link.classList.add('is-visible');
          this.previousSection = entry.target.getAttribute('id');
        } else {
          link.classList.remove('is-visible');
        }

        this.highlightFirstActive();
      }
      );
    },

    highlightFirstActive() {
      let firstVisibleLink = this.container.querySelector('.is-visible');

      this.links.forEach((link) => {
        link.classList.remove('usa-current');
      }
      );

      if (firstVisibleLink) {
        firstVisibleLink.classList.add('usa-current');
      }

      if (!firstVisibleLink && this.previousSection) {
        this.container.querySelector(`a[href="#${this.previousSection}"]`).classList.add('usa-current');
      }
    },

    observeSections() {
      this.headings.forEach((heading) => {
        this.observer.observe(heading);
      }
      );
    },

    setUpObserver() {
      this.observer = new IntersectionObserver(this.handleObserver, this.intersectionOptions);
    },

    findLinksAndHeadings() {
      this.links = [...this.container.querySelectorAll('a')];
      this.headings = this.links.map((link) => {
        let id = link.getAttribute('href');
        return document.querySelector(id);
      }
      );
    },
  };
  InPageNavigation.init();
});