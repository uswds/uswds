---
permalink: /layout-system/
layout: styleguide
title: Layout System
---

# Layout System

<h2>{% for layout in site.layout-system %}
	{{ layout.title }}
</h2>
  {{ layout.content }}
{% endfor %}
