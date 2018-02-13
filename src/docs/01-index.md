---
title: USWDS Utilities
---

## Introducing utilities
Utilities are simple HTML classes typically scoped to a single CSS property like `border-top` or `font-size`. Utilities can be used additively to style an object — it’s common to use multiple utilities on a single HTML element.

Utilities are commonly used for prototyping in HTML — they allow designers and developers to build and test new designs and components without the necessity of abstracting their work into semantic names or altering production CSS.

## USWDS production utilities and prototyping utilities
USWDS provides two types of utilities: those meant for production and those meant for prototyping.
The **production utilities** are a subset of the larger prototyping utilities set and are designed for production use with the project settings of an existing Design System implementation.

- values scoped to project settings
- only the most common properties
    - padding
    - margin
    - color
    - background-color
    - type size
    - display
    - font-style
    - font-weight
    - line-height
    - float and clear
    - border-radius
    - align
    - box-shadow
    - clearfix
- responsive scope for these properties
- fully browser prefixed (>5%)
- user-definable namespacing for reliable independence from existing styles and libraries
- semantic project settings values
- small-ish file (~35 KB)

The **prototyping utilities** give developers and designers access to the complete USWDS unit tokens palette to design with freedom and flexibility within the full gamut of the Design System, before making any decisions about project settings:
- all 325 colors
- all 20 steps of the type scale
- the complete whitespace scale, up to 50 grid units and negative units
- em, ch, and percentage values
- complete utilities for positioning and display, including flexbox
- complete sizing utilities, including height and width
- support for ::placeholder formatting
- support for :hover, :active, and :followed state styling
- all responsive scope
- succinct and not namespaced
- fully browser prefixed (>5%)
- large file (~3 MB)

However, this is a very large CSS file and it’s not suitable for production without subsetting.
