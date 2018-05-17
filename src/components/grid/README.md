## Grid

This 12-column, responsive grid provides structure for website content.

### Implementation

To use the grid, wrap each grid row in a `<div>` with the `usa-grid` class. To use a grid without padding on the right and left, use the `usa-grid-full` class instead.

Each grid item is written semantically by its width. For example: `usa-width-one-half` = 1/2 grid item, `usa-width-two-thirds` = 2/3 grid item.

Medium breakpoints are used for 1/6 and 1/12 grid items, which both transform into a 1/3 grid item at medium screen sizes.

All grid items are full-width at small screen sizes.

### Offsets

To move grid columns to the right, use the `usa-offset-*` classes. For example: `<div class="usa-width-one-third usa-offset-one-fourth">` would create a column that is 1/3rd the width of the grid and moved 1/4th of the width of the grid from the left margin.
