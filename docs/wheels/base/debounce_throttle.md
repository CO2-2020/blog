# 防抖与节流对比

## 防抖
#### 原理
防抖（`debounce`）：不管事件触发频率多高，一定在事件触发`n`秒后才执行，如果你在一个事件触发的 `n` 秒内又触发了这个事件，就以新的事件的时间为准，`n`秒后才执行，总之，触发完事件 `n` 秒内不再触发事件，`n`秒后再执行。（频繁触发就执行最后一次）
#### 应用场景

1. 窗口大小变化，调整样式
1. 搜索框，输入后1000毫秒搜索
1. 表单验证，输入1000毫秒后验证
1. 频繁点击按钮，使用防抖避免重复提交请求
#### 实现

- debunce实则是个包装函数，通过传入**操作函数**和**时间间隔**，来返回一个新函数
- 新函数中主要是通过**定时器**来设置函数调用的频率
- flag只有第一次触发的时候会立即执行
```javascript
//flag是否立即执行
function debounce(handler,ms,flag){
	let timer = null;
  return function(...args){
  	clearTimeout(timer);
    if(flag&&!timer){
    	handler.apply(this,args);
    }
    timer = setTimeout(()=>{
    	handler.apply(this,args);
    },ms)
  }
}
//demo
window.addEventListener('resize',debounce(handler,1000));
function handler(){
    console.log('ok');
}
```
## 节流

#### 原理
节流（`throttle`）:不管事件触发频率多高，只在单位时间内执行一次。（频繁触发，还是按照时间间隔执行）
#### 应用场景

1. 鼠标不断点击触发，mousedown(单位时间内只触发一次)
1. 监听滚动事件，比如是否滑到底部自动加载更多，用throttle来判断
#### 实现

- 和防抖不同的是，防抖中是取消定时器，节流中是定时器到时间自动执行，仅仅是将timer变量设置为null
- 时间戳版：第一次执行，最后一次不执行
- 定时器版：第一次不执行，最后一次执行
```javascript
//时间戳版
function throttle(handler,ms){
	let pre = 0;
  return function(...args){
  	if(Date.now()-pre>ms){
    	pre = Date.now();
      handler.apply(this,args);
    }
  }
}
//定时器版
function throttle(handler,ms){
	let timer = null;
  return function(...args){
  	if(!timer){
    	timer = setTimeout(()=>{
      	timer = null;
        handler.apply(this,args);
      },ms)
    }
  }
}
//demo
document.getElementById('btn').addEventListener('click', throttle1(handler, 1000))
function handler() {
    console.log('ok');
}
```
## 对比

防抖和节流都是防止在一段时间内频繁触发

- 防抖是在一段时间内只执行一次，频繁触发只执行最后一次
- 节流是在不管多频繁触发，都是间隔执行
