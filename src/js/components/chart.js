'use strict';

// Find all line charts on the page
var chartLine = document.querySelectorAll('.usa-chart');

for (var i = 0; i < chartLine.length; i++) {
  var chart = chartLine[ i ];
  var items = chart.querySelectorAll('.usa-chart-item');
  var chartType = chart.dataset.chartType;

  // Generate SVG dynamically
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 50');
  svg.classList.add('usa-chart-svg');
  // Insert SVG into DOM
  chart.appendChild(svg); // insert graphic into parent

  // Prep svg for elements
  var lines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  var labels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  var grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  var graphGap    = 10; // percent distributed across all gaps
  var topOffset   = 2;  // percent
  var graphOffset = 6;  // percent
  var graphHeight = 90; // percent
  var graphWidth  = 92; // percent
  var textBottom  = 3;  // percent

  // Default values
  var min         = 0;
  var max         = 100;
  var increment   = 20;

  // Set default chart type
  if (!chartType) {
    chartType = 'bar';
  }

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

  // Create line for line graph
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  var pathD = '';
  path.classList.add('usa-chart-path');

  // Draw data onto graph
  for (var j = 0; j < items.length; j++) {
    const item = items[ j ];

    var value = parseFloat(item.querySelector('.usa-chart-value').innerHTML.replace(/[^0-9\.]/g, ''));
    var x = ((graphOffset + (graphWidth / items.length * j) + graphGap / items.length) + ((graphWidth - graphGap) / items.length / 2));
    var y = (graphHeight - (value - min) * (graphHeight/(max-min)) + topOffset);

    // Generate line
    const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    point.classList.add('usa-chart-point');
    point.setAttribute('r', '1');
    point.setAttribute('cx', x + '%');
    point.setAttribute('cy', y + '%');
    if (j === 0) {
      pathD = 'M' + x + ' ' + (y/2);
    } else {
      pathD = pathD + ' L' + x + ' ' + (y/2);
    }

    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const labelValue = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.classList.add('usa-chart-labelText');
    labelValue.classList.add('usa-chart-labelValue');
    labelText.setAttribute('x', x + '%');
    labelText.setAttribute('y', 100 - textBottom + '%');
    labelText.innerHTML = item.querySelector('.usa-chart-label').innerHTML;
    labelValue.innerHTML = item.querySelector('.usa-chart-value').innerHTML;
    var labelValueY = y - 4;
    if(labelValueY < 10) {
      labelValueY = labelValueY + 12;
      labelValue.classList.add('usa-chart-labelValue-invert');
    }
    labelValue.setAttribute('x', x + '%');
    labelValue.setAttribute('y', labelValueY + '%');

    // Add line to chart
    if (chartType === 'line') {
      lines.appendChild(point);
    }

    labels.appendChild(labelText);
    labels.appendChild(labelValue);
  }

  for (var k = 0; k <= max; k) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const offset = graphHeight - (k * 90/max) + topOffset;

    line.classList.add('usa-chart-gridLine');
    label.classList.add('usa-chart-gridLabel');

    line.setAttribute('x1', graphOffset);
    line.setAttribute('y1', offset + '%');
    line.setAttribute('x2', graphWidth + graphOffset);
    line.setAttribute('y2', offset + '%');

    label.innerHTML = k;
    label.setAttribute('x', graphOffset - 1 + '%');
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
  svg.appendChild(lines);
  svg.appendChild(labels);

  path.setAttribute('d', pathD);
  svg.appendChild(path);

  // graph axis'
  const axis = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  axis.setAttribute('d', 'M ' + graphOffset + ' ' + (topOffset/2) + ' V ' + ((graphHeight+topOffset)/2) + ' H ' + (graphWidth + graphOffset));
  axis.classList.add('usa-chart-axis');
  svg.appendChild(axis);

  // Remove table from DOM
  chart.querySelector('.usa-chart-data').remove();
  chart.classList.add('rendered');
}
