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
  const { body } = document;

  // Did we load the metadata?
  if (!window.metadata) {
    return body.appendChild(renderTemplate('metadata-not-found'));
  }

  // Were there any failures?
  const failures = window.metadata.filter(info => info.failed);
  if (failures.length === 0) {
    return body.appendChild(renderTemplate('no-failures', {
      count: window.metadata.length,
    }));
  }

  // Show the failures.
  failures.forEach(info => {
    body.appendChild(renderTemplate('failure', info));
  });
};
