# 排序

### 1. 合并二维有序数组成一维有序数组，归并排序的思路
```javascript
const arr = [
    [2, 3, 4],
    [4, 6, 7],
    [5, 9, 23]
]
```
#### 思路

- 按照数组首项大小排序
- 然后按照归并排序排序进行排序
- 需要注意的是，划分到最细是两个长度为1的二维数组进行比较，需要降维处理
#### 实现
```javascript
function flat(arr) {
    //按照首项大小进行比较
    arr.sort((a, b) => a[0] - b[0]);
    return mergeSort(arr);
}
function mergeSort(arr) {
    if (arr.length < 2) return arr;
    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right) {
    if (Array.isArray(left[0])) {
        left = left[0];
    }
    if (Array.isArray(right[0])) {
        right = right[0];
    }
    let tmp = [];
    //合并两个有序数组
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            tmp.push(left.shift());
        } else {
            tmp.push(right.shift());
        }
    }
    while (left.length) {
        tmp.push(left.shift());
    }
    while (right.length) {
        tmp.push(right.shift());
    }
    return tmp;
}
//demo
const arr = [
    [2, 3, 4],
    [4, 6, 7],
    [5, 9, 23],
]
console.log(mergeSort(arr));
```


