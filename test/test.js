var assert = require('assert');
var amdetective = require('../');

describe('amdetective', function() {

  // soo many different forms via http://requirejs.org/docs/api.html

  it('works on Simple Name/Value Pairs', function() {
    var input = 'define({ color: "black", size: "unisize" });';
    assert.deepEqual(amdetective(input), []);
  });

  it('works on Definition Functions', function() {
    var input = 'define(function () { return { color: "black", size: "unisize" } });';
    assert.deepEqual(amdetective(input), []);
  });

  it('works on Definition Functions with Dependencies', function() {
    var input = [
      'define(["./cart", "./inventory"], function(cart, inventory) {',
      '//return an object to define the "my/shirt" module.',
      '  return {',
      '      color: "blue",',
      '      size: "large",',
      '      addToCart: function() {',
      '          inventory.decrement(this);',
      '          cart.add(this);',
      '      }',
      '  }',
      '});'].join('\n');
    assert.deepEqual(amdetective(input), [ './cart', './inventory' ]);
  });

  it('works on a Module as a Function', function() {
    var input = [
      'define(["my/cart", "my/inventory"],',
      '    function(cart, inventory) {',
      '        //return a function to define "foo/title".',
      '        //It gets or sets the window title.',
      '        return function(title) {',
      '            return title ? (window.title = title) :',
      '                   inventory.storeName + \' \' + cart.name;',
      '        }',
      '    }',
      ');'
    ].join('\n');
    assert.deepEqual(amdetective(input), ['my/cart', 'my/inventory']);
  });

  it('works on a Module with Simplified CommonJS Wrapper', function() {
    var input = [
      'define(function(require, exports, module) {',
      '        var a = require(\'a\'),',
      '            b = require(\'b\');',
      '',
      '        //Return the module value',
      '        return function () {};',
      '    }',
      ');'
    ].join('\n');
    assert.deepEqual(amdetective(input), [ 'require', 'exports', 'module', 'a', 'b' ]);
  });

  it('works on a Module with a Name', function() {
    var input = [
      'define("foo/title",',
      '    ["my/cart", "my/inventory"],',
      '    function(cart, inventory) {',
      '        //Define foo/title object in here.',
      '   }',
      ');'
    ].join('\n');
    assert.deepEqual(amdetective(input), [ { name: 'foo/title', deps: [ 'my/cart', 'my/inventory' ] } ]);
  });

  it('works on a named module with relative module names inside define()', function() {
    var input = [
      'define("foo/title", function() {',
      '    var a = require("a");',
      '    var b = require("b");',
      '});'
    ].join('\n');
    assert.deepEqual(amdetective(input), [ { name: 'foo/title', deps: [ 'a', 'b' ] } ]);
  });

  it('works with Relative module names inside define()', function() {
    var input = [
      'define(["require", "./relative/name"], function(require) {',
      '    var mod = require("./relative/name");',
      '});'
    ].join('\n');
    assert.deepEqual(amdetective(input), [ 'require', './relative/name' ]);
  });

  it('works with shortened syntax that is available for use with translating CommonJS modules', function() {
    var input = [
      'define(function(require) {',
      '    var mod = require("./relative/name");',
      '});'
    ].join('\n');
    assert.deepEqual(amdetective(input), [ 'require', './relative/name' ]);
  });

  it('works with Specify a JSONP Service Dependency', function() {
    var input = [
      'require(["http://example.com/api/data.json?callback=define"],',
      '    function (data) {',
      '        //The data object will be the API response for the',
      '        //JSONP data call.',
      '        console.log(data);',
      '    }',
      ');'
    ].join('\n');
    assert.deepEqual(amdetective(input), [ 'http://example.com/api/data.json?callback=define' ]);
  });

  it('works with Generate URLs relative to module', function() {
    // the `require.toUrl` is not treated specially here
    var input = [
      'define(["require"], function(require) {',
      '    var cssUrl = require.toUrl("./style.css");',
      '});'
    ].join('\n');
    assert.deepEqual(amdetective(input),  [ 'require' ]);
  });
  it('is able to detect a require.config block', function () {
    var input = [
      'require.config({',
      '  paths: {',
      '    myModule: "path/to/my/module"',
      '  }',
      '});'
    ].join('\n');
    assert.deepEqual(amdetective.parse.findConfig(input).config,  { paths: { myModule: 'path/to/my/module'} });
  })
});
