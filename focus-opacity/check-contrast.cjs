const assert = require('node:assert/strict');
const fs = require('node:fs');
const records = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const channels = (color) => color.match(/[\d.]+/g).slice(0, 3).map(Number);
function luminance(rgb) {
  const linear = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear.reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
}
const combo = records.find((record) => record.id === 'fruit-focus');
const button = combo.buttons.find((control) => control.focused);
assert.ok(button, 'The clear button must receive real keyboard focus.');
assert.equal(button.class, 'usa-combo-box__clear-input');
assert.equal(button.outlineStyle, 'solid');
assert.equal(button.outlineWidth, '4px');
const alpha = Number(button.opacity);
const background = channels(combo.background);
const composite = channels(button.outlineColor).map((channel, i) => alpha * channel + (1 - alpha) * background[i]);
const ratio = (Math.max(luminance(composite), luminance(background)) + 0.05) / (Math.min(luminance(composite), luminance(background)) + 0.05);
console.log(JSON.stringify({ outlineColor: button.outlineColor, opacity: alpha, composite, background, contrastRatio: ratio, meetsThreeToOne: ratio >= 3 }, null, 2));
for (const record of records) {
  for (const control of record.buttons.filter((item) => !item.focused)) {
    assert.equal(control.opacity, '0.6', `${record.id}: unfocused icon treatment must remain unchanged.`);
  }
}
assert.ok(ratio >= 3, 'The focused clear-button outline must have at least 3:1 contrast against the input background.');
