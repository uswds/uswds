const uswds = require("@uswds/compile");

// Use default USWDS compile settings (version 3)
uswds.settings.version = 3;

exports.init = uswds.init;
exports.compile = uswds.compile;
exports.copyAssets = uswds.copyAssets;
exports.default = uswds.compile;
