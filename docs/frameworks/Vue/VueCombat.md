# Vue 实战问题解析

## 1. 怎么给vue定义全局的方法？
1. window.method = method
1. 通过prototype，这个非常方便。Vue.prototype[method]=method;
1. 通过插件Vue.use(plugin)，本质还是使用Vue.prototype[method]=method;
1. 通过mixin，Vue.mixin(mixins);
1. 任意vue文件中写全局函数
```javascript
// 创建全局方法
this.$root.$on('test', function(){
    console.log('test');
})
// 销毁全局方法
this.$root.$off('test');
// 调用全局方法
this.$root.$emit('test');
```
