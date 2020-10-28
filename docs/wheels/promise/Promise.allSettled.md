# 手写Promise.allSettled

## 原理
```javascript
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

1. `Promise.allSettled()` 方法接受一组 `Promise` 实例作为参数，返回一个新的Promise实例。
2. 只有等到所有这些参数实例都返回结果，不管是 `fulfilled` 还是 `rejected` ，包装实例才会结束。
3. 返回的新 `Promise` 实例，一旦结束，状态总是 `fulfilled` ，不会变成 `rejected` 。
4. 新的 `Promise` 实例给监听函数传递一个数组 `results` 。该数组的每个成员都是一个对象，对应传入 `Promise.allSettled`的Promise实例。每个对象都有status属性，对应着 `fulfilled` 和 `rejected` 。 `fulfilled` 时，对象有 `value` 属性, `rejected` 时有 `reason` 属性，对应两种状态的返回值。
5. 有时候我们不关心异步操作的结果，只关心这些操作有没有结束时，这个方法会比较有用。
## 实现
```javascript
const formatSettledResult = (success, value) =>
    success ? { status: "fulfilled", value }
        : { status: "rejected", reason: value }

Promise.all_settled = function (iterators) {
    const promises = Array.from(iterators);
    const num = promises.length;
    const resultList = new Array(num);
    let resultNum = 0;
    
    return new Promise(resolve => {
        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    resultList[index] = formatSettledResult(true, value);
                    if (++resultNum === num) {
                        resolve(resultList);
                    }
                })
                .catch(error => {
                    resultList[index] = formatSettledResult(false,error);
                    if(++resultNum === num){
                        resolve(resultList);
                    }
                })
        })
    })
}
//demo
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);
Promise.all_settled([resolved,rejected]).then(results=>{
    console.log(results);
})
```
 

