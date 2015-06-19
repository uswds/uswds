---
permalink: /
layout: styleguide
title: Government-wide Pattern Library
---

# Component name

[Example]

<div class="grid-box">
  <div class="grid-item width-one-half annotation">
    <h3>Use</h3>
    <p>This demonstrates how to use the component. The grid layout system is a basic grid system used to build site pages where they layout is largely rectangular blocks of content (e.g., homepages and navigation pages).</p>
  </div>
  <div class="grid-item width-one-half annotation">
    <h3>Accessibility</h3>
    <p>Accessibility is one of the most important aspects of modern web development. Accessibility means the greatest number of users can view your content.</p>
  </div>  
</div> 

### Code


# About this Guide

This style guide is meant for as reference for designers, developers, as well as anyone else interested in the design and frontend concepts that make up the building blocks of federal government websites.

# Colors

This style guide automatically pulls colors from the `_variables.scss` file as long as the color variable is prefixed with `$color-`. Additionaly, website brand colors can be added in the `themes/my-theme.scss` file.

# Layout Systems

## Grid Layout

The grid layout system is a basic grid system used to build site pages where they layout is largely rectangular blocks of content (e.g., homepages and navigation pages). Content in the grid layout is placed with modular **grid items** which live inside **grid boxes**. Grid items require width classes to define what percentage of the screen they should take up. Width classes include:

- `.width-one-half`
- `.width-one-third`
- `.width-two-thirds`
- `.width-one-fourth`
- `.width-three-fourths`
- `.width-one-six`
- `.width-five-sixths`
- `.width-one-twelfth`
- `.width-five-twelfths`  
- `.width-seven-twelfths`
- `.width-eleven-twelfths`

<a href="#">Text link</a>

<button type="button">Button link</button>
