# 基础手写

## 1. 手写一个new
```javascript
function _new(fn, ...args) {
    let obj = Object.create(fn.prototype);
    let res = fn.apply(this, args);
    return typeof res === 'object' ? res : obj;
}
```
## 2. 实现call

1. 判断当前`this`是否为函数，防止`Function.prototype.myCall()` 直接调用
1. `context` 为可选参数，如果不传的话默认上下文为 `window`
1. 为`context` 创建一个 `Symbol`（保证不会重名）属性，将当前函数赋值给这个属性
1. 处理参数，传入第一个参数后的其余参数
1. 调用函数后即删除该`Symbol`属性
```javascript
Function.prototype.myCall = function (context = window, ...args) {
    //防止Function.prototype.myCall()直接调用
    if (this === Function.prototype) {
        return undefined;
    }
    context = context || window;
    let fn = Symbol();
    context[fn] = this;
    let result = context[fn](...args);
    delete context[fn];
    return result;
}
```
## 3. 实现apply
`apply`实现类似`call`，参数为数组
```javascript
Function.prototype.myApply = function (context = window, args) {
    if(this === Function.prototype){
        return undefined;
    }
    context = context || window;
    let fn = Symbol();
    context[fn] = this;
    let res;
    if(Array.isArray(args)){
       res = context[fn](...args);
    }else{
        res = context[fn]();
    }
    delete context[fn];
    return res;
}
```
## 4.实现bind

1. 返回一个函数
1. 可以传入参数
1. 返回的函数可以做构造函数
```javascript
Function.prototype.myBind = function (context, ...args) {
    //错误处理
    if (typeof this !== 'function') {
        throw new Error('Function.prototype.myBind must be a function');
    }
    let self = this;
    function fNop(){};
    //返回函数且传参
    function fBound(...args2) {
        self.apply(this instanceof self ? this : context, args.concat(args2));
    }
    //构造函数效果
    fNop.prototype = self.prototype;
    fBound.prototype = new fNop();
    return fBound;
}
```


## 
