# Page Visibility API 概念及使用场景

## 简介

---

用户离开页面，常用的是监听以下几个方法

- `pagehide`
- `beforeunload`
- `unload`



以下几种情况不会触发上面三个事件，因为手机系统会将一个进程转到后台然后杀死。

- 用户点击了一条系统通知，切换到另一个 App。
- 用户进入任务切换窗口，切换到另一个 App。
- 用户点击了 Home 按钮，切换回主屏幕。
- 操作系统自动切换到另一个 App（比如，收到一个电话）。
### 作用


`Page Visibility API` **不管手机或桌面电脑，所有情况下，这个 API 都会监听到页面的可见性发生变化。(除了正常的页面卸载还包括页面被系统切换和系统清除浏览器进程)**
### 使用场景


这个新的 API 的意义在于，通过**监听网页的可见性**，可以**预判网页的卸载**，还可以用来**节省资源，减缓电能的消耗**。比如，一旦用户不看网页，下面这些网页行为都是可以暂停的。


- 对服务器的轮询
- 网页动画
- 正在播放的音频或视频
## document.visibilityState

---

该属性返回一个字符串，表示页面当前的可见性状态，共有三个可能的值。

- `hidden`：页面彻底不可见。
- `visible`：页面至少一部分可见。
- `prerender`：页面即将或正在渲染，处于不可见状态。



`hidden` 状态和 `visible` 状态是所有浏览器都必须支持的。 `prerender` 状态只在支持"预渲染"的浏览器上才会出现，
只要页面可见，哪怕只露出一个角， `document.visibilityState` 属性就返回 `visible` 。


只有以下四种情况，才会返回 `hidden` 。


- 浏览器最小化。
- 浏览器没有最小化，但是当前页面切换成了背景页。
- 浏览器将要卸载（unload）页面。
- 操作系统触发锁屏屏幕。



注意， `document.visibilityState` 属性只针对顶层窗口，内嵌的页面的 `document.visibilityState` 属性由顶层窗口决定。使用 CSS 属性隐藏页面（比如display: none;），并不会影响内嵌页面的可见性。
## document.hidden

---

该属性只读，返回一个布尔值，表示当前页面是否可见。
当 `document.visibilityState` 属性返回 `visible` 时， `document.hidden` 属性返回 `false` 其他情况下，都返回 `true` 
## visibilitychange 事件

---

只要 `document.visibilityState` 属性发生变化，就会触发 `visibilitychange` 事件。因此，可以通过监听这个事件（通过 `document.addEventListener()` 方法或 `document.onvisibilitychange` 属性），跟踪页面可见性的变化。

**Page Visibility API 的最基本用法，可以监听可见性变化。**
```javascript

document.addEventListener('visibilitychange', function () {
  // 用户离开了当前页面
  if (document.visibilityState === 'hidden') {
    document.title = '页面不可见';
  }

  // 用户打开或回到页面
  if (document.visibilityState === 'visible') {
    document.title = '页面可见';
  }
});
```
**下面是另一个例子，一旦页面不可见，就暂停视频播放**
```javascript
var vidElem = document.getElementById('video-demo');
document.addEventListener('visibilitychange', startStopVideo);

function startStopVideo() {
  if (document.visibilityState === 'hidden') {
    vidElem.pause();
  } else if (document.visibilityState === 'visible') {
    vidElem.play();
  }
}
```
## 页面卸载

---

页面卸载可以分成三种情况。

- 页面可见时，用户关闭 Tab 页或浏览器窗口。
- 页面可见时，用户在当前窗口前往另一个页面。
- 页面不可见时，用户或系统关闭浏览器窗口。



这三种情况，都会触发 `visibilitychange` 事件。前两种情况，该事件在**用户离开页面**时触发；最后一种情况，该事件在页面**从可见状态变为不可见状态**时触发。
### 总结


由此可见， `visibilitychange` 事件比 `pagehide` 、 `beforeunload` 、 `unload` 事件更可靠，所有情况下都会触发（从 `visible` 变为 `hidden` ）。因此，**可以只监听这个事件，运行页面卸载时需要运行的代码，不用监听后面那三个事件。**
**
参考
[Page Visibility API 教程](http://www.ruanyifeng.com/blog/2018/10/page_visibility_api.html)
