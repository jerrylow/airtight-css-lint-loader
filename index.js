var checkCSS    = require('airtight-css-lint');
var loaderUtils = require('loader-utils');
var assign      = require("object-assign");

function checkCSSLoader(input, options, webpack, callback) {
  var results = [];

  checkCSS(input, function (line, col, msg) {
    results.push([ 'Line ' + line + ':' + col + ' - ' + msg ]);
  });

  if (results) {
    for (var i = 0; i < results.length; i++){
      if (options.failTypeError) {
        webpack.emitError(results[i]);
      } else {
        webpack.emitWarning(results[i]);
      }
    }

    if (options.failTypeError && options.failOnError) {
      throw new Error("Airtight CSS Lint Error");
    }
  }

  if (callback) {
    callback(null, input);
  }
}

module.exports = function(input) {
  var options = assign(
    {
      failTypeError: true,    // Use warning if false
      failOnError: true       // Only applies to errors
    },
    loaderUtils.parseQuery(this.query)
  );

  this.cacheable();
  var callback = this.async();

  if (!callback) {
    checkCSSLoader(input, options, this);

    return input;
  } else {
    try {
      checkCSSLoader(input, options, this, callback);
    } catch(e) {
      callback(e);
    }
  }
}
