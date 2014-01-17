# amdetective

Find all calls to `require()` in AMD modules.

This module uses code extracted from [r.js](https://github.com/jrburke/r.js) rather than trying to write it's own version of r.js parsing. It depends on esprima (but not r.js).

# Install

```
npm install amdetective
```

# example

## simple.js

````js
require(['module1', 'path/to/module2'], function(a, b){
  // ...
});
````

## simple2.js

````js
define(function(require) {
  var a = require('some/file'),
      b = require('json!foo/bar');
  // ...
});
````

## detect.js

This example file accepts a target path from command line so you can use it to inspect your own files as well:

````js
var fs = require('fs'),
    amdetective = require('amdetective');

console.log('Reading file from first argument: ' + process.argv[2]);
console.log(amdetective(fs.readFileSync(process.argv[2]).toString()));
````

Running: `node detect.js simple.js`

Output:

````
Reading file from first argument: simple.js
[ 'module1', 'path/to/module2' ]
````

Running: `node detect.js simple2.js`

Output:

````
Reading file from first argument: simple2.js
[ 'require', 'some/file', 'json!foo/bar' ]
````

# Methods

## amdetective(src, opts)

Given some source body `src`, return an array of all the `require()` call arguments detected by AMD/r.js.

The options parameter `opts` is passed along to `parse.recurse()`.

# License

BSD
