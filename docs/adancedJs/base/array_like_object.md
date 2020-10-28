# 数组和类数组

问题：类数组和数组的区别，dom的类数组如何转换成数组？
### 概念
所谓 **类数组对象**，即格式与数组结构类似，拥有 `length` 属性，可以通过**索引**来访问或设置里面的元素，但是**不能使用数组的方法**，就可以归类为**类数组对象**。<br/>
区别：**类数组对象的本质是对象，数组的方法不能使用，基本的类型判断也和数组有区别。**
### 常见类数组对象

- `arguments` 对象
- `NodeList` 
### 将类数组对象转化为数组

1. Array.from()
2. Array.prototype.slice.call()
3. ES6 spread运算符
```javascript
const memberList = [...document.getElementsByTagName("li")];

```

4. concat+apply
```javascript
const memberList = Array.prototype.concat.apply([], $('#MemberList li'));
```


