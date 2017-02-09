var checkCSS    = require('airtight-css-lint');
var loaderUtils = require('loader-utils');
var assign      = require("object-assign");
var sourceMap   = require('source-map');

function checkCSSLoader(source, options, webpack, map, callback) {
  var results = [];

  checkCSS(source, function (line, col, msg) {
    var message = 'Line ' + line + ':' + col + ' - ' + msg;
    if (map) {
      var smc = new sourceMap.SourceMapConsumer(map);
      var originalPos = smc.originalPositionFor({
        line: line,
        column: col
      });

      message = originalPos.source + ':' + originalPos.line + ':' + originalPos.column + ' - ' + msg;
    }

    results.push([message]);
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
