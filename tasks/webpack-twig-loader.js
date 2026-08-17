/**
 * Webpack loader that compiles `.twig` files into a render function.
 *
 * Adapted from `twigjs-loader` (https://github.com/megahertz/twigjs-loader),
 * which is itself based on `zimmo-be/twig-loader`. MIT-licensed (see below).
 * Vendored here to remove a dependency that is no longer actively maintained.
 *
 * ---
 *
 * MIT License
 *
 * Copyright (c) 2015 Zimmo.be
 * Copyright (c) 2018 Alexey Prokhorov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * ---
 *
 * Behavior is intended to be equivalent to the original at the default
 * configuration: each `.twig` module exports `function(context) { return html }`.
 * The Express integration and the configurable `renderTemplate` option from
 * the original have been removed; neither was used by this repo.
 *
 * Dependency resolution (for `{% include %}`, `{% extends %}`, `{% embed %}`,
 * `{% import %}`, `{% from %}`) goes through Webpack's resolver, so loader
 * `resolve.alias` entries (e.g. `@components`, `@templates`) work as expected.
 */

const path = require("path");
const Twig = require("twig");

// Disable Twig's internal template cache. Webpack handles caching at the
// module level; leaving Twig's cache on causes "There is already a template
// with the ID" errors during HMR.
Twig.cache(false);

module.exports = function twigLoader(source) {
  const callback = this.async();

  let template;
  try {
    template = Twig.twig({
      allowInlineIncludes: true,
      data: source,
      id: makeTemplateId(this, this.resourcePath),
      path: this.resourcePath,
      rethrow: true,
    });
  } catch (err) {
    return callback(err);
  }

  compile(this, template)
    .then((output) => callback(null, output))
    .catch((err) => callback(err));
};

async function compile(loaderApi, template) {
  const dependencies = [];

  await each(template.tokens, (token) =>
    processToken(loaderApi, token, dependencies),
  );

  const twigData = {
    allowInlineIncludes: true,
    data: template.tokens,
    id: template.id,
    rethrow: true,
  };

  const dependenciesString = [...new Set(dependencies)]
    .sort()
    .map((d) => `require(${JSON.stringify(d)});`)
    .join("\n");

  return renderTemplate(twigData, dependenciesString, loaderApi.hot);
}

async function processToken(loaderApi, token, dependencies) {
  if (token.type !== "logic" || !token.token.type) {
    return;
  }

  switch (token.token.type) {
    case "Twig.logic.type.block":
    case "Twig.logic.type.if":
    case "Twig.logic.type.elseif":
    case "Twig.logic.type.else":
    case "Twig.logic.type.for":
    case "Twig.logic.type.spaceless":
    case "Twig.logic.type.macro":
    case "Twig.logic.type.apply":
    case "Twig.logic.type.setcapture": {
      await each(token.token.output, (t) =>
        processToken(loaderApi, t, dependencies),
      );
      break;
    }

    case "Twig.logic.type.extends":
    case "Twig.logic.type.include": {
      await each(token.token.stack, (t) =>
        processDependency(loaderApi, t, dependencies),
      );
      break;
    }

    case "Twig.logic.type.embed": {
      await each(token.token.output, (t) =>
        processToken(loaderApi, t, dependencies),
      );
      await each(token.token.stack, (t) =>
        processDependency(loaderApi, t, dependencies),
      );
      break;
    }

    case "Twig.logic.type.import":
    case "Twig.logic.type.from": {
      // `_self` is a special token meaning "macros from this same file";
      // there is no external file to resolve.
      if (token.token.expression !== "_self") {
        await each(token.token.stack, (t) =>
          processDependency(loaderApi, t, dependencies),
        );
      }
      break;
    }

    default:
      // Other token types have no nested template references.
      break;
  }
}

async function processDependency(loaderApi, token, dependencies) {
  const absolutePath = await resolveModule(loaderApi, token.value);
  dependencies.push(token.value);
  // Rewrite the token's reference to a stable, root-relative id so Twig's
  // runtime lookup matches the id emitted by the dependency module.
  token.value = makeTemplateId(loaderApi, absolutePath);
  loaderApi.addDependency(absolutePath);
}

async function each(arr, callback) {
  if (!Array.isArray(arr)) return;
  await Promise.all(arr.map(callback));
}

function makeTemplateId(loaderApi, absolutePath) {
  const root = loaderApi.rootContext || process.cwd();
  return path.relative(root, absolutePath).split(path.sep).join("/");
}

function resolveModule(loaderApi, modulePath) {
  return new Promise((resolve, reject) => {
    loaderApi.resolve(loaderApi.context, modulePath, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

/**
 * Generates the JS module that Webpack emits for each .twig file.
 * `isHot` disables Twig's runtime cache on rebuild so HMR doesn't trip the
 * "duplicate template id" error.
 */
function renderTemplate(twigData, dependencies, isHot) {
  const hmrFix = isHot ? '\nrequire("twig").cache(false);' : "";
  return `
    ${dependencies}${hmrFix}
    var twig = require("twig").twig;
    var tpl = twig(${JSON.stringify(twigData)});
    module.exports = function(context) { return tpl.render(context); };
    module.exports.id = ${JSON.stringify(twigData.id)};
    module.exports.default = module.exports;
  `.replace(/^\s+/gm, "");
}
