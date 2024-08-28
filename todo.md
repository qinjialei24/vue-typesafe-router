## 增加环境判断
```js
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/xxx.prod.cjs')
} else {
  module.exports = require('./dist/xxx.cjs')
}
```
## 兼容vue2.x