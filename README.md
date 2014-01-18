depsormalize
============

Just for fun `deps` normalizer.

Work in progress.

```javascript
var depsormalize = require('depsormalize');
console.log(depsormalize({ block : 'i-bem', elems : ['dom', 'html'] }));
```

```
[ { block: 'i-bem' },
  { block: 'i-bem', elem: 'dom' },
  { block: 'i-bem', elem: 'html' } ]
```

## Install

```
› npm install git://github.com/narqo/depsormalize
```

## License

WTFPL
