# webpack 实战问题解析

## 1. webpack对于被多次引用的模块是如何处理的？会重复加载嘛？
不会，这个问题主要是涉及webpack的**模块化机制**。
首先看个案例，a.js
```javascript
export default function(){
    console.log('a');
}
```
b.js
```javascript
import a from './a';
export default function(){
    console.log('我是b');
    a();
}
```
入口文件index.js
```javascript
import a from './a';
import b from './b';
a();
b();
```
最后webpack编译的chunk如下：
```javascript
(function(modules) { // webpackBootstrap
	//模块方法定义
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
({
 "./src/a.js":
  (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function(){\n    console.log('a');\n});\n\n//# sourceURL=webpack:///./src/a.js?");
   }),
  
"./src/b.js":
  (function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a */ \"./src/a.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (function(){\n    console.log('我是b');\n    Object(_a__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n});\n\n//# sourceURL=webpack:///./src/b.js?");
  }),

"./src/index.js":
  (function(module, __webpack_exports__, __webpack_require__) {
  	"use strict";
  	eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./a */ \"./src/a.js\");\n/* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./b */ \"./src/b.js\");\n// function component() {\n//     var element = document.createElement('div');\n//     // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的\n//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');\n//     return element;\n//   }\n  \n//   document.body.appendChild(component());\n\n\n\nObject(_a__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\nObject(_b__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n\n//# sourceURL=webpack:///./src/index.js?");
  })
});
```
webpack在解析入口文件时，会通过入口文件来逐步分析模块依赖。最后生成的模板是一个立即执行包裹的函数，重新定义了__webpack_require__方法，模块依赖会按照各自标识的方式作为参数传递给函数。
上面编译出来的代码主要包含两个部分：Runtime，模块。上半部分就是Runtime，作用是保证模块顺序加载和运行。下半部分是我们的JS代码，包裹了一个函数，也就是模块。运行的时候模块是作为Runtime的参数被传进去的。
```javascript
(function(modules) {
    // Runtime
})([
    // 模块数组
])
```
webpack源码中，添加模块链的函数中，就在添加新的模块之前，先通过模块标识来判断是否存在，已经存在的模块不会重复添加到模块队列中。
```javascript
_addModule(module, callback) {
		const identifier = module.identifier();
		const alreadyAddedModule = this._modules.get(identifier);
		//根据模块标识，判断模块是否已经加载
		if (alreadyAddedModule) {
			return callback(null, alreadyAddedModule);
		}
  ...
}
```
### 总结：对于多次引用的模块是不会重复加载的。
## 2. webpack是怎么处理模块循环引用的情况的？
理论上循环引用会导致栈溢出，但并非所有循环引用都会导致栈溢出。
### 案例一（不会栈溢出）：
脚本文件`a.js`代码如下。
```javascript
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');
```
再看`b.js`的代码。
```javascript
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```
脚本`main.js`
```javascript
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);
```
编译结果：
```javascript
(function (modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    // 检查 installedModules 中是否存在对应的 module
    // 如果存在就返回 module.exports
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // 创建一个新的 module 对象，用于下面函数的调用
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    // 从 modules 中找到对应的模块初始化函数并执行
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // 标识 module 已被加载过
    module.l = true;
    return module.exports;
  }
  return __webpack_require__(__webpack_require__.s = "./src/index1.js");
})
  ({
    "./src/a.js":
      (function (module, exports, __webpack_require__) {
        exports.done = false;
        var b = __webpack_require__("./src/b.js");
        console.log('在 a.js 之中，b.done = %j', b.done);
        exports.done = true;
        console.log('a.js 执行完毕');
      }),
    "./src/b.js":
      (function (module, exports, __webpack_require__) {
        exports.done = false;
        var a = __webpack_require__("./src/a.js");
        console.log('在 b.js 之中，a.done = %j', a.done);
        exports.done = true;
        console.log('b.js 执行完毕');
      }),
    "./src/index1.js":
      (function (module, exports, __webpack_require__) {
        debugger;
        var a = __webpack_require__("./src/a.js");
        var b = __webpack_require__("./src/b.js");
        console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);
      })
  });
```
#### __webpack_require__ 做了以下几件事：

1. 根据 moduleId 查看 installedModules 中是否存在相应的 module ，如果存在就返回对应的 module.exports
1. 如果 module 不存在，就创建一个新的 module 对象，并且使 installedModules[moduleId] 指向新建的 module 对象
1. 根据 moduleId 从 modules 对象中找到对应的模块初始化函数并执行，依次传入 module，module.exports，__webpack_require__。可以看到，__webpack_require__ 被当作参数传入，使得所有模块内部都可以通过调用该函数来引入其他模块
1. 最后一步，返回 module.exports



#### 看具体的代码逻辑：

- `a.js`脚本先输出一个`done`变量，然后加载另一个脚本文件`b.js；`
- `b.js`执行到第二行，就会去加载`a.js`，这时，就发生了“循环加载”。系统会去`a.js`模块对应对象的`exports`属性取值，可是因为`a.js`还没有执行完，从`exports`属性只能取回已经执行的部分，而不是最后的值。 `a.js` 执行了一行，返回一个变量done，值为false；
- `b.js`接着往下执行，等到全部执行完毕，再把执行权交还给`a.js`
- `a.js`接着往下执行，直到执行完毕。

运行结果为
```javascript
在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
```
#### 总结

- webpack 遇到模块循环引用时，返回的是当前**已经执行的部分**的值，而不是代码全部执行后的值，两者可能会有差异；
- webpack 的模块模式是基于CommonJS模式的，输入的是被输出值的**拷贝**，不是引用。
### 案例二（栈溢出）：
a.js
```javascript
import f from './b';
export default val => {
    f('a');
    console.log(val);
}
```
b.js
```javascript
import f from './a';
export default val=>{
    f('b');
    console.log(val);
}
```
main.js
```javascript
import a from './a';
a(1);
```
如果模块导出是函数，这种循环引用是会栈溢出的。
### 解决方案
不管是上面哪种情况，在webpack打包的时候，都是不会报错的。所以可以借助插件
 circular-dependency-plugin来进行提示；

