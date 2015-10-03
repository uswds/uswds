Attempt to use Jekyll's advanced /_data/ directory to make attributes/objects from Open Datasets available within the website using:

http://jekyllrb.com/docs/datafiles/

"Data can then be accessed via site.data.filename(s) (note that the filename determines the variable name).

You could then render the list in another template using it

<ul>
{% for filename in site.data.filename(s) %}
  <li>
    <a href="https://github.com/{{ filename.attribute_1 }}">
      {{ filename.attribute_2 }}
    </a>
  </li>
{% endfor %}
</ul>
