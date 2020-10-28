# 递归问题

### 1. 斐波那契数列
```javascript
[1,1,2,3,5,8,13,21,34...]
F(0)=1,F(1)=1， F(n)=F(n - 1)+F(n - 2)（n ≥ 3，n ∈ N*）
```
#### 思路

- 前两项都是1
- 从第三项开始，每个数的值等于前两个数的和
#### 递归实现
```javascript
//注意这个n是指第几个不是指数组下标
function fb(n,n1=1,n2=1){
  //递归结束条件
	if(n<=1) return n;
  return fb(n-1,n2,n1+n2);
}
```
#### 循环实现
```javascript
function fb(n){
  //前两项直接返回
	if(n<=2) return 1;
  let n1 = 1,n2 = 1;
  for(let i =3; i<=n; i++){
  	[n1,n2] = [n2,n1+n2];
  }
  return n2;
}
```


