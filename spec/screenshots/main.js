const TEMPLATE_VAR_ATTRS = ["src", "href"];

function renderTemplate(id, context = {}) {
  const template = document.getElementById(id);
  const { content } = template;
  const $ = selector => content.querySelectorAll(selector);

  /* eslint-disable */
  Object.keys(context).forEach(name => {
    $(`[data-var="${name}"]`).forEach(el => {
      el.textContent = context[name];
    });

    TEMPLATE_VAR_ATTRS.forEach(attr =>
      $(`[data-var-${attr}="${name}"]`).forEach(el =>
        el.setAttribute(attr, context[name])
      )
    );
  });
  /* eslint-enable */

  return document.importNode(content, true);
}

/* eslint-disable consistent-return */
window.onload = () => {
  const main = document.querySelector("main");

  // Did we load the metadata?
  if (!window.metadata) {
    return main.appendChild(renderTemplate("metadata-not-found"));
  }

  // Were there any failures?
  const failures = window.metadata.filter(info => info.failed);
  if (failures.length === 0) {
    return main.appendChild(
      renderTemplate("no-failures", {
        count: window.metadata.length
      })
    );
  }

  // Show the failures.
  /* eslint-disable */
  failures.forEach(info => {
    resemble(info.goldenName)
      .compareTo(info.failName)
      .onComplete(data => {
        if (data.error) {
          // TODO: Add error handling here. Odds are the user is viewing
          // this page via a file: URL on a browser that has strict file
          // permissions, e.g. Chrome.
          console.log("resemble.js error:", data.error);
          info.diffUrl = "";
        } else {
          info.diffUrl = data.getImageDataUrl();
        }
        main.appendChild(renderTemplate("failure", info));
      });
  });
};
/* eslint-enable */
