
## Using color tokens
Your context and coding style determine how you access USWDS color tokens in code.

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
            color: color(<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>)
          </span>
        </td>
        <td data-title="Example">
          <span>
            color: color(<code>'red-50v'</code>)
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
            @include u-bg(<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>)
          </span>
        </td>
        <td data-title="Example">
          <span>
            @include u-bg(<code>'red-50v'</code>)<br/>
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
            @include u-text(<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>)<br/>
          </span>
        </td>
        <td data-title="Example">
          <span>
            @include u-text(<code>'red-50v'</code>)<br/>
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
            @include u-border(<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>)
          </span>
        </td>
        <td data-title="Example">
          <span>
            @include u-border(<code>'red-50v'</code>)<br/>
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
            @include u-underline(<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>)
          </span>
        </td>
        <td data-title="Example">
          <span>
            @include u-underline(<code>'red-50v'</code>)<br/>
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
            $theme-variable: <a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            $theme-color-warning: <code>'red-50v'</code>
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
            @include u-underline(<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>)
          </span>
        </td>
        <td data-title="Example">
          <span>
            @include u-underline(<code>'red-50v'</code>)<br/>
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
            .bg-<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .bg-<code>red-50v</code>
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
            .border-<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .border-<code>red-50v</code>
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
            .text-<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .text-<code>red-50v</code>
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
            .outline-<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .outline-<code>red-50v</code>
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
            .underline-<a href="{{ site.baseurl }}/design-tokens/color/state-tokens/" class="token">color</a>
          </span>
        </td>
        <td data-title="Example">
          <span>
            .underline-<code>red-50v</code>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
