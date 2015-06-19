---
permalink: /patterns/
layout: styleguide
title: Patterns
---

{% assign components = site.patterns | where:"type","component" %}
{% assign elements = site.patterns | where:"type","element" %}

# Elements

{% for element in elements %}
## {{ element.title }}
{{ element.content }}
{% endfor %}


# Components

{% for component in components %}
## {{ component.title }}
{{ component.content }}
{% endfor %}
