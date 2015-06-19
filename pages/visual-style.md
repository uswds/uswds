---
permalink: /visual-style/
layout: styleguide
title: Visual Style
---

# Visual Style

{% for visual in site.visual %}
## {{ visual.title }}
{{ visual.content }}
{% endfor %}
