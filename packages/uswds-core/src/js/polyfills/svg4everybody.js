/* eslint-disable */
!(function (factory) {
  module.exports = factory();
})(function () {
  /*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
  function embed(parent, svg, target, use) {
    // if the target exists
    if (target) {
      // create a document fragment to hold the contents of the target
      var fragment = document.createDocumentFragment(),
        viewBox =
          !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
      // conditionally set the viewBox on the svg
      viewBox && svg.setAttribute("viewBox", viewBox);
      // copy the contents of the clone into the fragment
      for (
        // clone the target
        var clone = document.importNode
            ? document.importNode(target, !0)
            : target.cloneNode(!0),
          g = document.createElementNS(
            svg.namespaceURI || "http://www.w3.org/2000/svg",
            "g",
          );
        clone.childNodes.length;

      ) {
        g.appendChild(clone.firstChild);
      }
      if (use) {
        for (var i = 0; use.attributes.length > i; i++) {
          var attr = use.attributes[i];
          "xlink:href" !== attr.name &&
            "href" !== attr.name &&
            g.setAttribute(attr.name, attr.value);
        }
      }
      fragment.appendChild(g), // append the fragment into the svg
        parent.appendChild(fragment);
    }
  }
  function loadreadystatechange(xhr, use) {
    // listen to changes in the request
    (xhr.onreadystatechange = function () {
      // if the request is ready
      if (4 === xhr.readyState) {
        // get the cached html document
        var cachedDocument = xhr._cachedDocument;
        // ensure the cached html document based on the xhr response
        cachedDocument ||
          ((cachedDocument = xhr._cachedDocument =
            document.implementation.createHTMLDocument("")),
          (cachedDocument.body.innerHTML = xhr.responseText), // ensure domains are the same, otherwise we'll have issues appending the
          // element in IE 11
          cachedDocument.domain !== document.domain &&
            (cachedDocument.domain = document.domain),
          (xhr._cachedTarget = {})), // clear the xhr embeds list and embed each item
          xhr._embeds.splice(0).map(function (item) {
            // get the cached target
            var target = xhr._cachedTarget[item.id];
            // ensure the cached target
            target ||
              (target = xhr._cachedTarget[item.id] =
                cachedDocument.getElementById(item.id)),
              // embed the target into the svg
              embed(item.parent, item.svg, target, use);
          });
      }
    }), // test the ready state change immediately
      xhr.onreadystatechange();
  }
  function svg4everybody(rawopts) {
    function oninterval() {
      // if all <use>s in the array are being bypassed, don't proceed.
      if (
        numberOfSvgUseElementsToBypass &&
        uses.length - numberOfSvgUseElementsToBypass <= 0
      ) {
        return void requestAnimationFrame(oninterval, 67);
      }
      // if there are <use>s to process, proceed.
      // reset the bypass counter, since the counter will be incremented for every bypassed element,
      // even ones that were counted before.
      numberOfSvgUseElementsToBypass = 0;
      // while the index exists in the live <use> collection
      for (
        // get the cached <use> index
        var index = 0;
        index < uses.length;

      ) {
        // get the current <use>
        var use = uses[index],
          parent = use.parentNode,
          svg = getSVGAncestor(parent),
          src = use.getAttribute("xlink:href") || use.getAttribute("href");
        if (
          (!src &&
            opts.attributeName &&
            (src = use.getAttribute(opts.attributeName)),
          svg && src)
        ) {
          if (polyfill) {
            if (!opts.validate || opts.validate(src, svg, use)) {
              // remove the <use> element
              parent.removeChild(use);
              // parse the src and get the url and id
              var srcSplit = src.split("#"),
                url = srcSplit.shift(),
                id = srcSplit.join("#");
              // if the link is external
              if (url.length) {
                // get the cached xhr request
                var xhr = requests[url];
                // ensure the xhr request exists
                xhr ||
                  ((xhr = requests[url] = new XMLHttpRequest()),
                  xhr.open("GET", url),
                  xhr.send(),
                  (xhr._embeds = [])), // add the svg and id as an item to the xhr embeds list
                  xhr._embeds.push({
                    parent: parent,
                    svg: svg,
                    id: id,
                  }), // prepare the xhr ready state change event
                  loadreadystatechange(xhr, use);
              } else {
                // embed the local id into the svg
                embed(parent, svg, document.getElementById(id), use);
              }
            } else {
              // increase the index when the previous value was not "valid"
              ++index, ++numberOfSvgUseElementsToBypass;
            }
          }
        } else {
          // increase the index when the previous value was not "valid"
          ++index;
        }
      }
      // continue the interval
      requestAnimationFrame(oninterval, 67);
    }
    var polyfill,
      opts = Object(rawopts),
      newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/,
      webkitUA = /\bAppleWebKit\/(\d+)\b/,
      olderEdgeUA = /\bEdge\/12\.(\d+)\b/,
      edgeUA = /\bEdge\/.(\d+)\b/,
      inIframe = window.top !== window.self;
    polyfill =
      "polyfill" in opts
        ? opts.polyfill
        : newerIEUA.test(navigator.userAgent) ||
          (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 ||
          (navigator.userAgent.match(webkitUA) || [])[1] < 537 ||
          (edgeUA.test(navigator.userAgent) && inIframe);
    // create xhr requests object
    var requests = {},
      requestAnimationFrame = window.requestAnimationFrame || setTimeout,
      uses = document.getElementsByTagName("use"),
      numberOfSvgUseElementsToBypass = 0;
    // conditionally start the interval if the polyfill is active
    polyfill && oninterval();
  }
  function getSVGAncestor(node) {
    for (
      var svg = node;
      "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode);

    ) {}
    return svg;
  }
  return svg4everybody;
});
