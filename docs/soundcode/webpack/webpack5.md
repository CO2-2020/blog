# webpack整体架构
## 1. 前置知识
- [npm包管理机制](https://mp.weixin.qq.com/s/wZUQA5_Jj4spyb87gdhe2g)
- [package.json相关知识](https://mp.weixin.qq.com/s/jMWoXzrw6WDi5VG9Y8Mn0Q)
- [node api](https://www.nodeapp.cn/)
- [webpack api](https://www.webpackjs.com/api/)
- [npmjs.com](https://www.npmjs.com/) 最好的nmp包查询文档，拒绝二手资料
- [webpack5文档](https://webpack.zcopy.site/configuration/#options) 暂时还是rc，手拿api说明文档，再也不怕看源码一头雾水
## 2. 基本结构

- 首先从 github 下载最新的代码，本地安装
- npm 包我们都是从 package.json 开始看起，可以看到基本依赖和入口文件等各种信息
- 从 package.json 中分别看出 `命令行工具入口` 和 `程序入口`
```javascript
  "main": "lib/index.js",//程序入口
  "bin": "./bin/webpack.js",//命令行工具入口
```
查看命令行工具入口，可以看出主要是检查相关依赖（webpack-cli）是否安装，以及报告错误信息。
我们这里重点还是看程序入口，也是 webpack 源码读取的开始。
## 3. 程序入口：index.js
```javascript
//核心代码，下文不再说明
const fn = lazyFunction(() => require("./webpack"));
module.exports = mergeExports(fn, { //merge函数
	get webpack() {
		return require("./webpack");
	},
	get Compiler() {
		return require("./Compiler");
	},
	get NormalModule() {
		return require("./NormalModule");
	},
  get Chunk() {
		return require("./Chunk");
	},
  get DefinePlugin() {
		return require("./DefinePlugin");
	},
	//...
});

```
从上文中核心代码可以看出，主程序入口主要是将webpack的主要编译对象、插件、模块向外导出。
接下来就是分模块来详细了解，webpack各个功能块是如何实现的。
## 4. webpack.js
路径为：webpack-master/lib/webpack.js
### 整体逻辑为：
![webpack5](~@alias/webpack/webpack01.jpg)
由上面脑图可知，主要导入的模块分为  `编译器相关`  和 `options配置相关` ,可以预先猜想到此文件中，主要是配置options和调用compiler
### webapck()
查看webpack函数，逻辑非常简单 
`webpack()` 接受2个参数，一个 `options` 和 `callback` 。
`webpack` 主体逻辑:

1. 首先校验options的合法性
2. 根据options来定义compiler watch watchOptions
3. 看是否为watch模式，来调用 `compiler.watch()` 或 `compiler.run()` 
```javascript
const webpack = ((
	options,
	callback
) => {
	//根据webpackOptionsSchema概要，校验options是否合法，这个函数没有返回，主要是做错误提示
	validateSchema(webpackOptionsSchema, options);
	
	//定义compiler watch watchOptions
	let compiler;
	let watch = false;
	let watchOptions;

	//创建compiler和watch以及watchoptions
	if (Array.isArray(options)) {
		//如果options是数组，创建多配置编译对象，以及watch和watch配置
		compiler = createMultiCompiler(options);
		watch = options.some(options => options.watch);
		watchOptions = options.map(options => options.watchOptions || {});
	} else {
		//大部分，options还是对象，单个配置编译对象
		compiler = createCompiler(options);
		watch = options.watch;
		watchOptions = options.watchOptions || {};
	}
	
	//必须有回调，没有回调编译不会执行，因为概要信息、错误都会传入回调
	if (callback) {
		//监听模式，则调用compiler.watch
		if (watch) {
			//返回一个 Watching 实例
			compiler.watch(watchOptions, callback);

		//非监听模式，则直接调用run
		} else {
			//run 方法用于触发所有编译时工作
			//这个 API 一次只支持一个并发编译
			compiler.run((err, stats) => {
				compiler.close(err2 => {
					//最终记录下来的概括信息(stats)和错误(errors)，应该在这个 callback 函数中获取。
					callback(err || err2, stats);
				});
			});
		}
	}
	return compiler;
});
```
### createCompiler()
webpack.js中核心函数，重点看其中的逻辑实现
```javascript
const createCompiler = rawOptions => {
	//标准化webpack配置项
	const options = getNormalizedWebpackOptions(rawOptions);
	//根据options设置默认context
	applyWebpackOptionsBaseDefaults(options);
	//根据context创建Compiler
	const compiler = new Compiler(options.context);
	//将标准化后的options设置成compiler的options属性
	compiler.options = options;
	//环境变量方法设置compiler
	new NodeEnvironmentPlugin({
		infrastructureLogging: options.infrastructureLogging
	}).apply(compiler);
	//处理plugins
	if (Array.isArray(options.plugins)) {
		for (const plugin of options.plugins) {
			if (typeof plugin === "function") {
				plugin.call(compiler, compiler);
			} else {
				plugin.apply(compiler);
			}
		}
	}
  
	//*重点一* webpack 设置默认配置
	applyWebpackOptionsDefaults(options);
  
	//环境钩子执行
	compiler.hooks.environment.call();
	compiler.hooks.afterEnvironment.call();
  
	//*重点二* 根据options，调用内置插件，来配置compiler实例
	new WebpackOptionsApply().process(options, compiler);
  
	//初始化钩子
	compiler.hooks.initialize.call();
	return compiler;
};
```
主要的逻辑就是：

1. options的操作。主要集中在标注了重点的两个模块 `applyWebpackOptionsDefaults` 和 `WebpackOptionsApply` ，后续会重点分析。这两个模块涉及到所有webpack的配置属性相关的api以及plugin，和我们平常开发使用是密切相关的。webpack的文档可读性不是很强，源码的难度更加大，但是将源码和api文档结合，会有奇效。枯燥的源码能在api上找到说明，就不会那么不知所云。
1. compiler相关。这个肯定是要重点分析的，后续会跟上。

webpack.js整体逻辑分析就到这，后续会按照这个基础逻辑分支开来，按模块逐个分析。
webpack.js 逐行分析已经上传至个人[github](https://github.com/CO2-2020/webpack5-analysis/blob/49bb015a74c4ca4e2dc8ea05c6366442a54f3a6a/webpack.js)。欢迎star。
## 5. Tapable
在研究 compiler 之前，先来了解事件流实现方式。
Tapable 是一个典型的发布订阅库。类似 `Node` 的 `EventEmitter` ,专注于定制事件发射和操作。具体使用和说明可以查询[https://www.npmjs.com/package/tapable](https://www.npmjs.com/package/tapable)
Tapable，基本使用，可以查看这篇文章[https://www.cnblogs.com/tugenhua0707/p/11317557.html](https://www.cnblogs.com/tugenhua0707/p/11317557.html)





