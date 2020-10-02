const elproto = window.HTMLElement.prototype;
const HIDDEN = "hidden";

if (!(HIDDEN in elproto)) {
  Object.defineProperty(elproto, HIDDEN, {
    get() {
      return this.hasAttribute(HIDDEN);
    },
    set(value) {
      if (value) {
        this.setAttribute(HIDDEN, "");
      } else {
        this.removeAttribute(HIDDEN);
      }
    },
  });
}
