normalize-deps
==============

Stand alone [`deps` format](http://bem.info/tools/bem/bem-tools/depsjs/#deps-js-syntax) normalizer.

**NOTE**: This module is in work in progress state.

```javascript
var normalizeDeps = require('normalize-deps');
console.log(normalizeDeps({ block : 'i-bem', elems : ['dom', 'html'] }));
```

```
[ { block: 'i-bem' },
  { block: 'i-bem', elem: 'dom' },
  { block: 'i-bem', elem: 'html' } ]
```

## License

WTFPL
