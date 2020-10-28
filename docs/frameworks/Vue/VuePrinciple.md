# Vue API原理解析
## 1. 说一下 vm.$set 原理
### 源码
```javascript
 function set(target, key, val) {
   //1.类型判断
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    //2.数组处理
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      //如果不设置length，splice时，超过原本数量的index则不会添加空白项
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    //3.对象，且key不是原型上的属性处理
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    //通过判断target对象是否存在__ob__属性来判断target是否是响应式数据
    var ob = (target).__ob__;
   
    //4. 对象不能是 Vue 实例，或者 Vue 实例的根数据对象
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    //5.target是非响应式数据时
    if (!ob) {
      target[key] = val;
      return val
    }
   //6.target对象是响应式数据时
    defineReactive$$1(ob.value, key, val);//定义响应式对象
    ob.dep.notify();//watcher执行
    return val
  }
```
从源码可以看出set主要逻辑如下：

1. 类型判断
1. target为数组：调用splice方法
1. target为对象，且key不是原型上的属性处理：直接修改
1. target不能是 Vue 实例，或者 Vue 实例的根数据对象，否则报错
1. target是非响应式数据时，我们就按照普通对象添加属性的方式来处理
1. target为响应数据，且**key为新增属性**，我们key设置为响应式，并手动触发其属性值的更新
### 总结：
vm.$set(target、key、value)当target为数组时，直接调用数组方法splice实现；当target为对象，且key是对象上非原型属性的属性时，直接修改；当target不是响应对象时，直接修改；target为响应数据且key为新增属性时，将key也设置成响应式，并手动触发更新
