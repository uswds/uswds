const TEMPLATE_VAR_ATTRS = [
  'src',
  'href',
];

function renderTemplate (id, context) {
  context = context || {};
  const template = document.getElementById(id);
  const { content } = template;
  const $ = selector => content.querySelectorAll(selector);
  Object.keys(context).forEach(name => {
    $(`[data-var="${name}"]`).forEach(el => {
      el.textContent = context[ name ];
    });
    TEMPLATE_VAR_ATTRS.forEach(attr => {
      $(`[data-var-${attr}="${name}"]`).forEach(el => {
        el.setAttribute(attr, context[ name ]);
      });
    });
  });
  return document.importNode(content, true);
}

window.onload = () => {
  const main = document.querySelector('main');

  // Did we load the metadata?
  if (!window.metadata) {
    return main.appendChild(renderTemplate('metadata-not-found'));
  }

  // Were there any failures?
  const failures = window.metadata.filter(info => info.failed);
  if (failures.length === 0) {
    return main.appendChild(renderTemplate('no-failures', {
      count: window.metadata.length,
    }));
  }

  // Show the failures.
  failures.forEach(info => {
    main.appendChild(renderTemplate('failure', info));
  });
};
