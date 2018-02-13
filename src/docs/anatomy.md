---
title: Anatomy of a utility
---
USWDS utilities use a consistent method of naming — the core of which is based on the concepts of **base**, **modifier**, and **value**.

To better understand these concepts, it’s helpful to think of a simple CSS property/value pair. In the case of `border-top-width: 1px` we might break down its parts as

- **base**: `border-width`
- **modifier**: `top`
- **value**: `1px`

USWDS utilities use succinct shorthand notation to save characters, typing, and file size. In our system, `border-width` is represented by `b` and `top` is represented by `t`, resulting in

- **base**: `b`
- **modifier**: `t`
- **value**: `1px`

The utility is named by combining the three elements.

[base]-*[modifier]-*[value]

*These elements are separated by hyphens if either of the connected elements is readable on its own.*

So, for the property/value pair in our example (`border-top-width: 1px`), the corresponding utility would be `bt1px`. (There are no hyphens since none of the constituent parts are readable on their own.)

Every CSS property included in our utilities is assigned a base. Some of these properties have modifiers, and each accept a certain set of values. So, this is how we’d describe the border-width prototyping utility:
```
property:  border-width
base:      b
modifiers:
    t      top
    r      right
    b      bottom
    l      left
    x      left and right
    y      top and bottom
    [none] all sides
values:
    0     none
    1px
    2px
    05    0.5 grid units (4px)
    1     1 grid unit (8px)
    105   1.5 grid units (12px)
    2     2 grid units (16px)
```

Example utilities made with border-width
```
bb2px   → a border of 2px on the bottom
by1     → a border 1 grid unit (8px) on the top and bottom
b0      → no border on all sides
br05    → a border of 0.5 grid units (4px) on the right
```
