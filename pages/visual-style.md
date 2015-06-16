---
permalink: /visual-style/
layout: default
title: Visual Style
---

<h2>Visual Style</h2>
<ul>
{% for visual in site.visual %}
	<li>{{ visual.title }}</li>
{% endfor %}
</ul>
