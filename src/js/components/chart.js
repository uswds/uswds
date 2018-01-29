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
  var labels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  var grid   = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  var lines  = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  var bars   = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  var graphGap    = 10; // percent distributed across all gaps
  var topOffset   = 3;  // percent
  var graphOffset = 6;  // percent
  var graphHeight = 88; // percent
  var graphWidth  = 92; // percent
  var textBottom  = 2;  // percent

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

    // Draw bars
    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bar.classList.add('usa-chart-bars');
    bar.setAttribute('width', (graphWidth - graphGap) / items.length + '%');
    bar.setAttribute('height', 'calc(' + (value - min) * (graphHeight/(max-min)) + '%)');
    bar.setAttribute('x', (x - (graphWidth - graphGap) / items.length / 2) + '%');
    bar.setAttribute('y', y + '%');

    // Draw line
    const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    if (chartType === 'line') {
      point.classList.add('usa-chart-point');
      point.setAttribute('r', '1');
      point.setAttribute('cx', x + '%');
      point.setAttribute('cy', y + '%');
      if (j === 0) {
        pathD = 'M' + x + ' ' + (y/2);
      } else {
        pathD = pathD + ' L' + x + ' ' + (y/2);
      }
    }

    // Draw labels
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

    if (chartType === 'bar') {
      bars.appendChild(bar);
    }

    labels.appendChild(labelText);
    labels.appendChild(labelValue);
  }

  for (var k = 0; k <= max; k) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const offset = graphHeight - (k * graphHeight/max) + topOffset;

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
  svg.appendChild(labels);

  if (chartType === 'line') {
    path.setAttribute('d', pathD);
    lines.appendChild(path);
    svg.appendChild(lines);
  }

  if (chartType === 'bar') {
    svg.appendChild(bars);
  }

  // graph axis'
  const axis = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  axis.setAttribute('d', 'M ' + graphOffset + ' ' + (topOffset/2) + ' V ' + ((graphHeight+topOffset)/2) + ' H ' + (graphWidth + graphOffset));
  axis.classList.add('usa-chart-axis');
  svg.appendChild(axis);

  // Remove table from DOM
  chart.querySelector('.usa-chart-data').remove();
  chart.classList.add('rendered');
}
