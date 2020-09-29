## Responsive embed container

The `usa-embed-container` class can be applied to a `div` that contains an `<iframe>` to ensure the content inside the `<iframe>` is responsive.

The `usa-embed-container` class does not define a maximum width and `<iframe>` content will expand to fill the space it is given. A `max-width` property may be applied to the parent container to restrict the width of the embedded content.

The `usa-embed-container` class currently assumes the embedded content fits a 16:9 aspect ratio – the default on the most popular video hosting providers. The `$aspect-width` and `$aspect-height` variables in the `_embed` component may be adjusted to support additional aspect ratios.
