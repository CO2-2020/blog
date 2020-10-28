# 其他类型算法

### 1. 写一个 mySetInterVal(fn, a, b),每次间隔 a,a+b,a+2b 的时间，然后写一个 myClear，停止上面的 mySetInterVal


#### 思路

- 借助构造函数内部方法(闭包)来共享：打印次数、定时器标识、时间间隔参数等
- 使用setTimeout来模拟setInterval的关键是，fn中递归调用自身，形成循环
- clearTimeout来取消定时器
#### 实现
```javascript
function mySetInterVal(fn, a, b) {
    this.timer = null;
    this.a = a;
    this.b = b;
    this.num = 0;
    this.start = () => {
        let ms = this.a + this.b * this.num;
        this.timer = setTimeout(() => {
            fn();
            console.log(ms);
            this.num++;
            this.start();
        }, ms)
    };
    this.stop = () => {
        clearInterval(this.timer);
        this.num = 0;
    }
}
//demo
var a = new mySetInterVal(() => { console.log('123') }, 1000, 2000);
a.start();
setTimeout(() => {
    a.stop();
}, 10000)
```
