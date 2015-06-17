---
permalink: /visual-style/
layout: styleguide
title: Visual Style
---

# Visual Style
<ul>
{% for visual in site.visual %}
	<li>{{ visual.title }}</li>
{% endfor %}
</ul>
