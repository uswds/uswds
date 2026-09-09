const assert = require("assert");
const fs = require("fs");
const path = require("path");

const modal = require("../index");
const comboBox = require("../../../usa-combo-box/src/index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "template.html"));
const modalWindowSelector = () => document.querySelector(".usa-modal");
const bodySelector = () => document.body;
const openButton1Selector = () => document.querySelector("#open-button1");
const openButton2Selector = () => document.querySelector("#open-button2");

const comboListSelector = () => document.querySelector("#nestedCB--list");

const tests = [
  { name: "document.body", selector: bodySelector },
  { name: "modal", selector: modalWindowSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Modal window initialized at ${name}`, () => {
    const { body } = document;

    let closeButton;
    let modalWrapper;
    let modalWindow;
    let openButton1;
    let openButton2;
    let overlay;
    let comboList;
    let comboBoxToggleButton;

    const isVisible = (el) => el.classList.contains("is-visible");

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      modal.on(containerSelector());
      comboBox.on(containerSelector());
      modalWindow = modalWindowSelector();
      closeButton = body.querySelector("#close-button");
      modalWrapper = body.querySelector(".usa-modal-wrapper");
      overlay = body.querySelector(".usa-modal-overlay");
      openButton1 = openButton1Selector();
      openButton2 = openButton2Selector();

      comboList = comboListSelector();
      comboBoxToggleButton = body.querySelector(".usa-combo-box__toggle-list");
    });

    afterEach(() => {
      modal.off(containerSelector());
      comboBox.off(containerSelector());
      body.innerHTML = "";
      body.className = "";
    });

    describe("Builds the modal HTML", () => {
      it("creates new parent elements", () => {
        assert.ok(modalWindow, "creates inner div");
        assert.ok(overlay, "creates the overlay");
        assert.ok(modalWrapper, "creates the outer div");
      });

      it('adds role="dialog" to modal parent', () => {
        assert.strictEqual(modalWrapper.getAttribute("role"), "dialog");
      });

      it('sets aria-hidden="true" on the closed dialog wrapper', () => {
        assert.strictEqual(modalWrapper.getAttribute("aria-hidden"), "true");
      });

      it("moves aria-labelledby, aria-describedby, and id to the parent", () => {
        assert.strictEqual(modalWindow.hasAttribute("aria-describedby"), false);
        assert.strictEqual(modalWindow.hasAttribute("aria-labelledby"), false);
        assert.strictEqual(modalWindow.hasAttribute("id"), false);
        assert.strictEqual(modalWrapper.hasAttribute("aria-describedby"), true);
        assert.strictEqual(modalWrapper.hasAttribute("aria-labelledby"), true);
        assert.strictEqual(modalWrapper.getAttribute("id"), "modal");
      });

      it('sets tabindex="-1" to the modal window', () => {
        assert.strictEqual(modalWindow.getAttribute("tabindex"), "-1");
      });

      it("moves the modal to the bottom of the DOM", () => {
        assert.strictEqual(
          body.lastElementChild.classList.contains("usa-modal-wrapper"),
          true,
        );
      });

      it('adds role="button" to any <a> opener, but not <button>', () => {
        assert.strictEqual(openButton1.getAttribute("role"), "button");
        assert.strictEqual(openButton2.hasAttribute("role"), false);
      });

      it("adds aria-controls to each opener", () => {
        assert.strictEqual(openButton1.getAttribute("aria-controls"), "modal");
        assert.strictEqual(openButton2.getAttribute("aria-controls"), "modal");
      });
    });

    describe("When opened", () => {
      beforeEach(() => {
        openButton1.click();
      });

      it("makes the modal visible", () => {
        assert.strictEqual(isVisible(modalWrapper), true);
      });

      it("focuses the first footer button when opened", () => {
        assert.strictEqual(
          document.activeElement,
          body.querySelector(".usa-modal__footer button"),
        );
      });

      it('sets aria-modal="true" on the dialog wrapper', () => {
        assert.strictEqual(modalWrapper.getAttribute("aria-modal"), "true");
      });

      it("removes aria-hidden from the dialog wrapper", () => {
        assert.strictEqual(modalWrapper.hasAttribute("aria-hidden"), false);
      });

      it("makes all other page content invisible to screen readers", () => {
        const activeContent = document.querySelectorAll(
          "body > :not([aria-hidden])",
        );

        assert.strictEqual(activeContent.length, 1);
        assert.strictEqual(activeContent[0], modalWrapper);
      });

      it("Allows event propagation and displays combobox list when toggle is clicked", () => {
        comboBoxToggleButton.click();

        assert.ok(!comboList.hidden, "should display the combobox option list");
      });
    });

    describe("When closing", () => {
      beforeEach(() => {
        openButton2.click();
      });

      it("hides the modal when close button is clicked", () => {
        closeButton.click();
        assert.strictEqual(isVisible(modalWrapper), false);
      });

      it("closes the modal when the overlay is clicked", () => {
        overlay.click();
        assert.strictEqual(isVisible(modalWrapper), false);
      });

      it("sends focus to the element that opened it", () => {
        closeButton.click();
        assert.strictEqual(document.activeElement, openButton2);
      });

      it('restores aria-hidden="true" on the dialog wrapper', () => {
        closeButton.click();
        assert.strictEqual(modalWrapper.getAttribute("aria-hidden"), "true");
        assert.strictEqual(modalWrapper.hasAttribute("aria-modal"), false);
      });

      it("restores other page content screen reader visibility", () => {
        closeButton.click();
        const activeContent = document.querySelectorAll(
          "body > :not([aria-hidden])",
        );
        const staysHidden = document.getElementById("stays-hidden");
        assert.strictEqual(activeContent.length, 3);
        assert.strictEqual(staysHidden.hasAttribute("aria-hidden"), true);
      });

      it("restores page content when the opener has left the document", () => {
        // The view holding the opener re-renders while the modal is open, so
        // the element `data-opener` points at is gone by the time we close.
        // Another opener remains, so only the focus target is missing.
        openButton2.remove();

        closeButton.click();

        const staysHidden = document.getElementById("stays-hidden");
        assert.strictEqual(
          document.querySelectorAll("[data-modal-hidden]").length,
          0,
        );
        assert.strictEqual(
          document.getElementById("other-content").hasAttribute("aria-hidden"),
          false,
        );
        assert.strictEqual(staysHidden.hasAttribute("aria-hidden"), true);
      });
    });

    describe("Open focus target", () => {
      it("focuses a [data-focus] element over the footer button", () => {
        const customFocus = document.createElement("button");
        customFocus.type = "button";
        customFocus.setAttribute("data-focus", "");
        customFocus.textContent = "Custom focus";

        modalWrapper.querySelector(".usa-modal__main").prepend(customFocus);
        openButton1.click();

        assert.strictEqual(document.activeElement, customFocus);
      });

      it("focuses any button when the footer has no buttons", () => {
        modalWrapper.querySelector(".usa-modal__footer").remove();
        modalWrapper.querySelector(".usa-combo-box").remove();

        openButton1.click();

        assert.strictEqual(document.activeElement, closeButton);
      });
    });
  });
});
