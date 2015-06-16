---
permalink: /patterns/
layout: default
title: Patterns
---

{% assign components = site.patterns | where:"type","component" %}
{% assign elements = site.patterns | where:"type","element" %}

<h2>Components</h2>
<ul>
{% for component in components %}
	<li>{{ component.title }}</li>
{% endfor %}
</ul>

<h2>Elements</h2>
<ul>
{% for element in elements %}
	<li>{{ element.title }}</li>
{% endfor %}
</ul>