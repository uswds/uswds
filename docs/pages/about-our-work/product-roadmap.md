---
permalink: /about-our-work/product-roadmap/
layout: styleguide
title: Product roadmap
category: About our work
lead: Here, you’ll find our product roadmap — an up-to-date report on the work we’re doing.
---

<p class="usa-font-lead">We’ve categorized our work into four themes:</p>

<ul class="usa-content-list usa-font-lead">
  <li>Deciding to use the Standards</li>
  <li>Working with the Standards</li>
  <li>Giving back (contributing) to the Standards</li>
  <li>Using a federal website that incorporates the Standards as a member of the public</li>
</ul>

{% for milestone in site.data.milestones %}
<section id="milestone-{{ milestone.id }}">
  <h2>{{ milestone.title }}</h2>
  <ul>
  {% for task in milestone.tasks %}
    <li>
      {{ task.title }}
      {% if task.status %}
        <div class="tooltip">
          <p class="tooltip-text" id="tooltip-text-{{ task.title | slugify }}">See our progress on this milestone.</p>
          <a class="usa-label label-{{ task.status | slugify }}" href="{{ task.url }}" aria-describedby="tooltip-text-{{ task.title | slugify }}">
            {{ task.status }}
          </a>
        </div>
      {% endif %}
    </li>
  {% endfor %}
  </ul>
</section>
{% endfor %}
