# Promise实现

问题介绍下promise 的特性、优缺点，内部是如何实现的，动手实现Promise？？？？？
## 基本用法
MDN **Promise **对象用于表示一个**异步操作的最终完成 (或失败)及其结果值**。
```javascript
const promise = new Promise((resolve,reject)=>{
	//...
  if(/*异步操作成功*/){
    resolve(); 
   }else{
  	reject();
  }
})
promise.then((value)=>{
  //回调处理
}).catch((err)=>{
	//错误处理
})
promise.then();promise.catch();promise.finally();
Promise.reslove();Promise.reject();
Promise.all();Promise.race();Promise.allSettled();
//提案
Promise.try();Promise.any();
```
## 特性
Promise是一种异步解决方案，主要是为了解决原本回调方式带来的地狱回调问题；

1. Promise有三个状态（pending、resolved、rejected），状态不受外界影响只由异步操作结果控制，状态一旦改变就不会再变；
1. `Promise.prototype.then()` `Promise.prototype.catch()` 返回一个新的promise，所以可以链式调用，将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数

## 优缺点
优点：

- 链式调用解决了地狱回调问题，程序流程清晰
- 一整套接口，可以实现许多强大的功能
- 为多个回调函数中抛出的错误，统一制定处理方法

缺点：

- 无法取消，一旦新建就会立即执行，无法中途取消；
- 当处于`pending`状态时，无法得知目前进展到哪一个阶段（刚开始还是快结束）
- 如果不设置回调函数，内部错误无法反应到外部
## 实现
### 1. 基本结构

- 设定三个状态 `PENDING、FULFILLED、REJECTED` ，只能由`PENDING`改变为`FULFILLED、REJECTED`，并且只能改变一次
- `MyPromise`接收一个函数`executor`，`executor`有两个参数`resolve`方法和`reject`方法
- `resolve`将`PENDING`改变为`FULFILLED`
- `reject`将`PENDING`改变为`FULFILLED`
- `promise`变为`FULFILLED`状态后具有一个唯一的`value`
- `promise`变为`REJECTED`状态后具有一个唯一的`reason`
```javascript
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(executor) {
    this.state = PENDING;
    this.value = null;
    this.reason = null;

    const resolve = (value) => {
        if (this.state === PENDING) {
            this.state = FULFILLED;
            this.value = value;
        }
    }

    const reject = (reason) => {
        if (this.state === PENDING) {
            this.state = REJECTED;
            this.reason = reason;
        }
    }

    try {
        executor(resolve, reject);
    } catch (reason) {
        reject(reason);
    }
}
```
### 2. then方法

- `then`方法接受两个参数`onFulfilled、onRejected`，它们分别在状态由`PENDING`改变为`FULFILLED、REJECTED`后调用
- 一个`promise`可绑定多个`then`方法
- `then`方法可以同步调用也可以异步调用
- 同步调用：状态已经改变，直接调用`onFulfilled`方法
- 异步调用：状态还是`PENDING`，将`onFulfilled、onRejected`分别加入两个函数数组`onFulfilledCallbacks、onRejectedCallbacks`，当异步调用`resolve`和`reject`时，将两个数组中绑定的事件循环执行。
```javascript
function MyPromise(executor) {
    this.state = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(fun => {
          fun();
        });
      }
    }

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fun => {
          fun();
        });
      }
    }

    try {
      executor(resolve, reject);
    } catch (reason) {
      reject(reason);
    }
  }

  MyPromise.prototype.then = function (onFulfilled, onRejected) {
    switch (this.state) {
      case FULFILLED:
        onFulfilled(this.value);
        break;
      case REJECTED:
        onFulfilled(this.value);
        break;
      case PENDING:
        this.onFulfilledCallbacks.push(() => {
          onFulfilled(this.value);
        })
        this.onRejectedCallbacks.push(() => {
          onRejected(this.reason);
        })
        break;
    }
  }
```
### 3. then异步调用
虽然`resolve`是同步执行的，我们必须保证`then`是异步调用的，我们用`settimeout`来模拟异步调用（并不能实现微任务和宏任务的执行机制，只是保证异步调用）
```javascript
MyPromise.prototype.then = function (onFulfilled, onRejected) {
    if (typeof onFulfilled != 'function') {
        onFulfilled = function (value) {
            return value;
        }
    }
    if (typeof onRejected != 'function') {
        onRejected = function (reason) {
            throw reason;
        }
    }
    switch (this.state) {
        case FULFILLED:
            setTimeout(() => {
                onFulfilled(this.value);
            }, 0);
            break;
        case REJECTED:
            setTimeout(() => {
                onRejected(this.reason);
            }, 0);
            break;
        case PENDING:
            this.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    onFulfilled(this.value);
                }, 0);
            })
            this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    onRejected(this.reason);
                }, 0);
            })
            break;
    }
}
```
### 4. then链式调用
保证链式调用，即`then`方法中要返回一个新的`promise`，并将`then`方法的返回值进行`resolve`。
```javascript
MyPromise.prototype.then = function (onFulfilled, onRejected) {
      if (typeof onFulfilled != 'function') {
        onFulfilled = function (value) {
          return value;
        }
      }
      if (typeof onRejected != 'function') {
        onRejected = function (reason) {
          throw reason;
        }
      }
      const promise2 = new MyPromise((resolve, reject) => {
        switch (this.state) {
          case FULFILLED:
            setTimeout(() => {
              try {
                const x = onFulfilled(this.value);
                resolve(x);
              } catch (reason) {
                reject(reason);
              }
            }, 0);
            break;
          case REJECTED:
            setTimeout(() => {
              try {
                const x = onRejected(this.reason);
                resolve(x);
              } catch (reason) {
                reject(reason);
              }
            }, 0);
            break;
          case PENDING:
            this.onFulfilledCallbacks.push(() => {
              setTimeout(() => {
                try {
                  const x = onFulfilled(this.value);
                  resolve(x);
                } catch (reason) {
                  reject(reason);
                }
              }, 0);
            })
            this.onRejectedCallbacks.push(() => {
              setTimeout(() => {
                try {
                  const x = onRejected(this.reason);
                  resolve(x);
                } catch (reason) {
                  reject(reason);
                }
              }, 0);
            })
            break;
        }
      })
      return promise2;
    }
```
### 5. [完整版](https://www.yuque.com/u1113084/dsregg/duu9at)
## 拓展
### 取消拓展
```html
<button id="start">Start</button>
<button id="cancel">Cancel</button>
 <script>
 //取消拓展
        class CancelToken {
            constructor(cancelFn) {
                this.promise = new Promise((resolve, reject) => {
                    cancelFn(() => {
                        setTimeout(console.log, 0, "delay cancelled9999");
                        resolve();
                    });
                });
            }
        }        
        const startButton = document.querySelector('#start');
        const cancelButton = document.querySelector('#cancel');
        function cancellableDelayedResolve(delay) {
            setTimeout(console.log, 0, "set delay");
            return new Promise((resolve, reject) => {
                //原本延时定时器
                const id = setTimeout((() => {
                    setTimeout(console.log, 0, "delayed resolve");
                    resolve();
                }), delay);
                //生成cancelToken实例
                const cancelToken = new CancelToken((cancelCallback) => {
                    cancelButton.addEventListener("click", cancelCallback)
                });
                cancelToken.promise.then(() => clearTimeout(id));
            });
        }
        startButton.addEventListener("click", () => cancellableDelayedResolve(3000)); 
  </script>
```
### 进度通知拓展
```javascript
//进度通知拓展
class TrackablePromise extends Promise {
    constructor(executor) {
        const notifyHandlers = [];
        super((resolve, reject) => {
            return executor(resolve, reject, (status) => {
                notifyHandlers.map((handler) => handler(status));
            });
        });
        this.notifyHandlers = notifyHandlers;
    }
    notify(notifyHandler) {
        this.notifyHandlers.push(notifyHandler);
        return this;
    }
}
let p = new TrackablePromise((resolve, reject, notify) => {
    function countdown(x) {
        if (x > 0) {
            notify(`${20 * x}% remaining`);
            setTimeout(() => countdown(x - 1), 1000);
        } else {
            resolve();
        }
    }
    countdown(5);
});
p.notify((x) => setTimeout(console.log, 0, 'progress:', x));
p.then(() => setTimeout(console.log, 0, 'completed'));

p.notify((x) => setTimeout(console.log, 0, 'a:', x))
    .notify((x) => setTimeout(console.log, 0, 'b:', x));
p.then(() => setTimeout(console.log, 0, 'completed'));
```


