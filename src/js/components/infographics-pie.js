'use strict';

// Find all pie charts on the page
var chartPie = document.querySelectorAll('.usa-chart-pie');

// Loop throuigh each chart to generate graphic
for (var i = 0; i < chartPie.length; i++) {

  var chart = chartPie[ i ];
  var items = chart.querySelectorAll('.usa-chart-item');
  var total = 100;
  var offset = 0;

  // If there is a user defined total use it
  if (chart.querySelector('.usa-chart-data').dataset.total) {
    total = parseFloat(chart.querySelector('.usa-chart-data').dataset.total.replace(/[^0-9\.]/g, ''));
  }

  // Generate SVG dynamically
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 75');
  svg.classList.add('usa-chart-svg');
  // Insert SVG into DOM
  chart.insertBefore(svg, chart.querySelector('table')); // insert graphic into parent

  for (var j = 0; j < items.length; j++) {
    const item = items[ j ];
    var value = parseFloat(item.querySelector('.usa-chart-value').innerHTML.replace(/[^0-9\.]/g, ''));

    // generate arc
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    arc.classList.add('usa-chart-arc');
    arc.setAttribute('cx', '50%');
    arc.setAttribute('cy', '50%');
    arc.setAttribute('r', '25%');
    arc.style.strokeDasharray = ( (value / total * 100) * Math.PI / 2) + '%, 999%';
    arc.style.strokeDashoffset = ( (offset / total * 100) * Math.PI / -2) + '%';

    // Add hover events to labels+graphic
    arc.addEventListener('mouseenter', function (event) {
      item.classList.add('hover');
    });
    arc.addEventListener('mouseleave', function (event) {
      item.classList.remove('hover');
    });
    item.addEventListener('mouseenter', function (event) {
      arc.classList.add('hover');
    });
    item.addEventListener('mouseleave', function (event) {
      arc.classList.remove('hover');
    });

    // Add arc to graphic
    svg.appendChild(arc);
    // Offset for next arc
    offset = offset + parseInt(value);
  }
  chart.classList.add('rendered');
}
