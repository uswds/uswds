module.exports = {
  plugins: [
    {
      // removeViewBox is intentionally excluded. In svgo v4, it is not part
      // of preset-default and must be explicitly added to run. Omitting it
      // ensures viewBox attributes are preserved on all optimized SVGs.
      name: 'preset-default',
    },
  ],
}

