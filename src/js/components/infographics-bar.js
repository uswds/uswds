'use strict';

// Find all bar charts on the page
var chartBar = document.querySelectorAll('.usa-chart-bar');

for (var i = 0; i < chartBar.length; i++) {
  var chart = chartBar[ i ];
  var items = chart.querySelectorAll('.usa-chart-item');

  // Generate SVG dynamically
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 50');
  svg.classList.add('usa-chart-svg');
  // Insert SVG into DOM
  chart.appendChild(svg); // insert graphic into parent

  // Prep svg for elements
  var bars = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  var labels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  var grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  var barGap     = 10; // percent distributed across all gaps
  var topOffset  = 2;  // percent
  var leftOffset = 6;  // percent
  var barHeight  = 90; // percent
  var barWidth   = 92; // percent
  var textBottom = 3;  // percent

  // Default values
  var min = 0;
  var max = 100;
  var increment = 20;

  // Overrides from markup
  if(chart.querySelector('.usa-chart-data').dataset.min) {
    min = parseFloat(chart.querySelector('.usa-chart-data').dataset.min.replace(/[^0-9\.]/g, ''));
  }
  if(chart.querySelector('.usa-chart-data').dataset.max) {
    max = parseFloat(chart.querySelector('.usa-chart-data').dataset.max.replace(/[^0-9\.]/g, ''));
  }
  if(chart.querySelector('.usa-chart-data').dataset.increment) {
    increment = parseFloat(chart.querySelector('.usa-chart-data').dataset.increment.replace(/[^0-9\.]/g, ''));
  }

  // Draw bars onto graph
  for (var j = 0; j < items.length; j++) {
    const item = items[ j ];

    var value = parseFloat(item.querySelector('.usa-chart-value').innerHTML.replace(/[^0-9\.]/g, ''));

    // Generate bar
    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const labelValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bar.classList.add('usa-chart-bars');
    labelText.classList.add('usa-chart-labelText');
    labelValue.classList.add('usa-chart-labelValue');
    bar.setAttribute('width', (barWidth - barGap) / items.length + '%');
    bar.setAttribute('height', 'calc(' + (value - min) * (barHeight/(max-min)) + '%)');
    var x = barWidth / items.length * j;
    var xOffset = barGap / items.length;
    bar.setAttribute('x', (leftOffset + x + xOffset) + '%');
    bar.setAttribute('y', (barHeight - (value - min) * (barHeight/(max-min)) + topOffset) + '%');

    labelText.setAttribute('x', ((leftOffset + x + xOffset) + ((barWidth - barGap) / items.length / 2)) + '%');
    labelText.setAttribute('y', 100 - textBottom + '%');

    var labelValueY = (barHeight - (value - min) * (barHeight/(max-min)) + topOffset) - 2;
    if(labelValueY < 5) {
      labelValueY = labelValueY + 8;
      labelValue.classList.add('usa-chart-labelValue-invert');
    }
    labelValue.setAttribute('x', ((leftOffset + x + xOffset) + ((barWidth - barGap) / items.length / 2)) + '%');
    labelValue.setAttribute('y', labelValueY + '%');

    labelText.innerHTML = item.querySelector('.usa-chart-label').innerHTML;
    labelValue.innerHTML = item.querySelector('.usa-chart-value').innerHTML;

    // Add bar to chart
    bars.appendChild(bar);
    labels.appendChild(labelText);
    labels.appendChild(labelValue);
  }

  for (var k = 0; k <= max; k) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const offset = barHeight - (k * 90/max) + topOffset;

    line.classList.add('usa-chart-gridLine');
    label.classList.add('usa-chart-gridLabel');

    line.setAttribute('x1', leftOffset);
    line.setAttribute('y1', offset + '%');
    line.setAttribute('x2', barWidth + leftOffset);
    line.setAttribute('y2', offset + '%');

    label.innerHTML = k;
    label.setAttribute('x', leftOffset - 1 + '%');
    label.setAttribute('y', offset + 1.7 + '%');

    k = k + increment;
    // grid is on by default unless it’s turned off
    if(chart.querySelector('.usa-chart-data').dataset.grid != 'false') {
      grid.appendChild(line);
    }
    grid.appendChild(label);
  }

  // Add items to chart
  svg.appendChild(grid);
  svg.appendChild(bars);
  svg.appendChild(labels);

  // graph axis'
  const axis = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  axis.setAttribute('d', 'M ' + leftOffset + ' ' + (topOffset/2) + ' V ' + ((barHeight+topOffset)/2) + ' H ' + (barWidth + leftOffset));
  axis.classList.add('usa-chart-axis');
  svg.appendChild(axis);

  // Remove table from DOM
  chart.querySelector('.usa-chart-data').remove();
  chart.classList.add('rendered');
}
