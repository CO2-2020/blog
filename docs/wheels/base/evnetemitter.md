# 手写发布订阅

问题 发布订阅、EventEmitter
## 发布订阅的优点

- 可以**广泛用于异步编程**，可以替换传统的回调函数
- 无需关注异步操作的内部状态，只需要关注事件完成的节点
- 取代对象之间硬编码通知机制，一个对象不必显式地去调用另一个对象的接口，而是松耦合的联系在一起
## NodeJS中的EventEmitter
`Nodejs`的`EventEmitter`是观察者模式的典型实现，`Nodejs`的`events`模块只提供了一个对象： `events.EventEmitter`
`webpack`  的插件机制核心库  `tapable`  也是发布订阅模式的典型实现。**
## 实现

- **addListener(event, listener)**
- **removeListener(event, listener)**
- **setMaxListeners(n)**
- **once(event, listener)**
- **emit(event, [arg1], [arg2], [...])**
```javascript
function EventEmitter() {
      this._maxListeners = 10;
      this._events = Object.create(null);
    }

    // 向事件队列添加事件
    // prepend为true表示向事件队列头部添加事件
    EventEmitter.prototype.addListener = function (type, listener, prepend) {
      if (!this._events) {
        this._events = Object.create(null);
      }
      if (this._events[type]) {
        if (prepend) {
          this._events[type].unshift(listener);
        } else {
          this._events[type].push(listener);
        }
      } else {
        this._events[type] = [listener];
      }
    };

    // 移除某个事件
    EventEmitter.prototype.removeListener = function (type, listener) {
      if (Array.isArray(this._events[type])) {
        if (!listener) {
          delete this._events[type]
        } else {
          this._events[type] = this._events[type].filter(e => e !== listener && e.origin !== listener)
        }
      }
    };

    // 向事件队列添加事件，只执行一次
    EventEmitter.prototype.once = function (type, listener) {
      const only = (...args) => {
        listener.apply(this, args);
        this.removeListener(type, listener);
      }
      only.origin = listener;
      this.addListener(type, only);
    };

    // 执行某类事件
    EventEmitter.prototype.emit = function (type, ...args) {
      if (Array.isArray(this._events[type])) {
        this._events[type].forEach(fn => {
          fn.apply(this, args);
        });
      }
    };

    // 设置最大事件监听个数
    EventEmitter.prototype.setMaxListeners = function (count) {
      this.maxListeners = count;
    };
```







