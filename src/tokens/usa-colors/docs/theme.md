## Using theme color tokens
Your context and coding style determine how you access USWDS theme color tokens in code.

For example, all three of the following examples result in the same output:

```
// function
div {
  background-color: color("primary");
}

// mixin
div {
  @include u-bg("primary");
}

// utility
<div class="bg-primary">...</div>

```

<div class="site-table-wrapper">
  <table class="usa-table--borderless site-table-responsive">
    <thead>
      <tr>
        <th scope="col">Context</th>
        <th scope="col">Usage</th>
        <th scope="col">Example</th>
      </tr>
    </thead>
    <tbody class="font-mono-2xs">
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">function</span>
        </th>
        <td data-title="Description">
          <span>
            color(<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>)
          </span>
        </td>
        <td data-title="Example">
          <span>
            color: color(<code>'primary-vivid'</code>)
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">
            <span>mixin</span><br/>
            <span class="text-normal">background-color</span>
          </span>
        </th>
        <td data-title="Description">
          <span>
            u-bg(<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>)
          </span>
        </td>
        <td data-title="Example">
          <span>
            @include u-bg(<code>'primary-vivid'</code>)<br/>
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">
            <span>mixin</span><br/>
            <span class="text-normal">color</span>
          </span>
        </th>
        <td data-title="Description">
          <span>
            u-text(<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>)<br/>
          </span>
        </td>
        <td data-title="Example">
          <span>
            @include u-text(<code>'primary-vivid'</code>)<br/>
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">
            <span>mixin</span><br/>
            <span class="text-normal">border-color</span>
          </span>
        </th>
        <td data-title="Description">
          <span>
            u-border(<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>)
          </span>
        </td>
        <td data-title="Example">
          <span>
            @include u-border(<code>'primary-vivid'</code>)<br/>
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">
            <span>mixin</span><br/>
            <span class="text-normal">text-decoration-color</span>
          </span>
        </th>
        <td data-title="Description">
          <span>
            u-underline(<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>)
          </span>
        </td>
        <td data-title="Example">
          <span>
            @include u-underline(<code>'primary-vivid'</code>)<br/>
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span>
            <span class="font-lang-3">setting</span><br/>
          </span>
        </th>
        <td data-title="Description">
          <span>
            <a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            $theme-border-color: <code>'primary-vivid'</code>
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">
            <span>utility</span><br/>
            <span class="text-normal">background-color</span>
          </span>
        </th>
        <td data-title="Description">
          <span>
            .bg-<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .bg-<code>base-lighter</code>
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">
            <span>utility</span><br/>
            <span class="text-normal">border-color</span>
          </span>
        </th>
        <td data-title="Description">
          <span>
            .border-<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .border-<code>primary</code>
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">
            <span>utility</span><br/>
            <span class="text-normal">color</span>
          </span>
        </th>
        <td data-title="Description">
          <span>
            .text-<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .text-<code>primary</code>
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">
            <span>utility</span><br/>
            <span class="text-normal">outline-color</span>
          </span>
        </th>
        <td data-title="Description">
          <span>
            .outline-<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .outline-<code>primary</code>
          </span>
        </td>
      </tr>
      <tr>
        <th scope="row" data-title="Context">
          <span class="font-lang-3">
            <span>utility</span><br/>
            <span class="text-normal">text-decoration-color</span>
          </span>
        </th>
        <td data-title="Description">
          <span>
            .underline-<a href="{{ site.baseurl }}/design-tokens/color/theme-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .underline-<code>primary-vivid</code>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
