var checkCSS    = require('airtight-css-lint');
var loaderUtils = require('loader-utils');
var assign      = require("object-assign");

function checkCSSLoader(source, options, webpack, map, callback) {
  var results = [];

  checkCSS(source, function (line, col, msg) {
    results.push([ 'Line ' + line + ':' + col + ' - ' + msg ]);
  });

  if (results.length) {
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
    callback(null, source, map);
  }
}

module.exports = function(source, map) {
  var options = assign(
    {
      failTypeError: true,    // Use warning if false
      failOnError: true       // Only applies to errors
    },
    loaderUtils.parseQuery(this.query)
  );

  if (map !== null && typeof map !== "string") {
		map = JSON.stringify(map);
	}

  this.cacheable();
  var callback = this.async();

  if (!callback) {
    checkCSSLoader(source, options, this, map);

    return source;
  } else {
    try {
      checkCSSLoader(source, options, this, map, callback);
    } catch(e) {
      callback(e);
    }
  }
}
