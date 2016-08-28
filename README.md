# wxs.js

[![npm](https://img.shields.io/npm/v/wxs.js.svg?style=flat-square)](https://www.npmjs.com/package/wxs.js)

wxs javascript sdk

## Readme
js sdk for [wxs services](https://wxs.yeliex.com)

## Installation
```
$ npm install wxs.js --save
```

## Usage
```
// Browser
<script src="node_modules/wxs.js/dist/index.js"></script>
<script>
  Wechat = Wechat({
    id: wxs appid,
    mobile: your wxs account mobile,
    token: wxs app token
  });
</script>
 
// With import
import { WXS: Wechat } from 'wxs.js';

const Wechat = WXS({
  id: wxs appid,
  mobile: your wxs account mobile,
  token: wxs app token
}); // leave the options empty the second time
 
// With CommonJs
const Wechat = require('wxs.js').Wechat({
  id: wxs appid,
  mobile: your wxs account mobile,
  token: wxs app token
});
```
## API Documention
see [wxs services](https://wxs.yeliex.com/doc)
