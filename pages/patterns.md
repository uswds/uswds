---
permalink: /patterns/
layout: styleguide
title: Patterns
---

{% assign components = site.patterns | where:"type","component" %}
{% assign elements = site.patterns | where:"type","element" %}

# Components
<ul>
{% for component in components %}
	<li>{{ component.title }}</li>
{% endfor %}
</ul>

# Elements
<ul>
{% for element in elements %}
	<li>{{ element.title }}</li>
{% endfor %}
</ul>