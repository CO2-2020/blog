# 闭包

问题：对闭包的看法，为什么要用闭包？说一下闭包原理以及应用场景?<br/>
关键词：闭包、作用域链、垃圾回收机制、内存泄漏、私有变量
## 定义
MDN 闭包（**closure**）是**函数**和声明该函数的**词法环境**的组合。
ECMAScript中，闭包指的是：

1. 从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
1. 从实践角度：以下函数才算是闭包：
   1. 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
   1. 在代码中引用了自由变量



## 原理
闭包的实现原理，其实是利用了**作用域链**的特性，我们都知道作用域链就是在当前执行环境下访问某个变量时，如果不存在就一直向外层寻找，最终寻找到最外层也就是全局作用域，这样就形成了一个链条。
### 从JavaScript执行机制来理解闭包
执行机制中理解闭包（scope）
## 作用

1. 保护函数内的**变量安全**
1. 在内存中**维持一个变量**
1. 通过保护变量的安全实现JS**私有属性和私有方法**

以上3点是闭包最基本的应用场景，很多经典案例都源于此。
## 应用场景
### 1. 模仿块级作用域
比如我们可以使用闭包能使下面的代码按照我们预期的进行执行（每隔1s打印 0,1,2,3,4）。
```javascript
for(var i = 0; i < 5; i++) {
    (function(j){
        setTimeout(() => {
            console.log(j);
        }, j * 1000);
    })(i)
}
```
### 2. 私有变量
私有变量包括函数的**参数**，**局部变量**和函数内部定义的**其他函数**。

- 在构造函数中定义特权方法
```javascript
function MyObject() {
    // 私有变量和私有函数
    var privateVariable = 10;
    function privateFunction() {
        return false;
    }
    // 特权方法
    this.publicMethod = function() {
        privateVariable++;
        return privateFunction;
    }
}
```

- 利用私有和特权成员，可以隐藏那些不应该被直接修改的数据
```javascript
function Foo(name){
    this.getName = function(){
        return name;
    };
};
var foo = new Foo('luckyStar');
console.log(foo.name); //  => undefined
console.log(foo.getName()); //  => 'luckyStar'
```
### 3. 静态私有变量
```javascript
(function() {
    var name = '';
    //
    Person = function(value) {
        name = value;
    }
    Person.prototype.getName = function() {
        return name;
    }
    Person.prototype.setName = function(value) {
        name = value;
    }
})()

var person1 = new Person('xiaoming');
console.log(person1.getName()); // xiaoming
person1.setName('xiaohong');
console.log(person1.getName()); // xiaohong

var person2 = new Person('luckyStar');
console.log(person1.getName()); // luckyStar
console.log(person2.getName()); // luckyStar
```
这种模式下，`name` 就变成了一个静态的、由所有实例共享的属性。在一个实例上调用 `setName()` 会影响所有的实例。
### 4. 模块模式
模块模式使用了一个返回对象的匿名函数。在这个匿名函数内部，首先定义了私有变量和函数.
```javascript
var singleton = function() {
    var privateVarible = 10;
    function privateFunction() {
        return false;
    }

    return {
        publicProperty: true,
        publicMethod: function() {
            privateVarible++;
            return privateFunction();
        }
    }
}
```
### 5. Vue源码中使用到的闭包

- 数据响应式Observer中使用闭包
```javascript
function defineReactive(obj, key, value) {
    return Object.defineProperty(obj, key, {
        get() {
            return value;
        },
        set(newVal) {
            value = newVal;
        }
    })
}
```

- 缓存结果

因为它不会释放外部的引用，从而函数内部的值可以得以保留。
```javascript
/**
* Create a cached version of a pure function.
*/
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
  })
}
```
## 性能分析
### 优点：

- 一个变量长期存储在内存中，用于缓存
- 避免全局变量的污染。
- 私有成员的存在
### 缺点：

- 内存常驻，内存消耗大
- 闭包滥用，会造成内存泄漏
- 避免修改外部函数的私有变量





参考：<br/>
[深入理解JavaScript](https://www.cnblogs.com/TomXu/archive/2011/12/15/2288411.html)<br/>
[深入理解JavaScript闭包之闭包的使用场景](https://juejin.im/post/6855129007969697805#heading-13)
