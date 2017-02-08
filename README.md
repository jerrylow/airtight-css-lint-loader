# Airtight CSS Lint Webpack Loader
A webpack loader for [Airtight CSS Linter](https://github.com/unframework/airtight-css-lint)

## Options

### failTypeError

`boolean` `default: true`

This will output errors if true. If this is set to false warnings will be used instead. The difference is messaging as well as ability to fail on error.

### failOnError

`boolean` `default: true`

If the `failTypeError` is set to `true` this option grants the ability to fail the webpack process.
