# 排序案例
## topK 问题？
>快排的时间复杂度是多少？如果数组特别大，怎么优化？小顶堆/大顶堆的时间复杂度是多少？
LeetCode涉及到topK问题的两道题<br />[剑指 Offer 40. 最小的k个数](https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)<br />[215. 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)<br />解题方法：

- 方法一：快排变形，（平均）时间复杂度 _O_(_n_)
- 方法二：堆，时间复杂度 _O_(_n_log_k_)
- 两种方法的优劣比较
<a name="hg9U7"></a>
### 快排变形

**思路：**
1. 利用快排思想，每次partition操作返回一个位置，将其与k-1进行对比，从而减少排序范围
   
**优化：**
1. 随机数作为pivot元素：最极端的是顺序数组与倒序数组，时间复杂度是 O(N^2)，根本达不到减治的效果，随机交换第 1 个元素与它后面的任意 1个元素的位置，来作为随机数pivot。
2. partition函数使用双指针：将与 `pivot` 相等的元素等概论地分到 `pivot` 最终排定位置的两边。
   
**复杂度分析**：
- **时间复杂度**：因为我们是要找下标为k的元素，第一次切分的时候需要遍历整个数组 (0 ~ n) 找到了下标是 j 的元素，假如 k 比 j 小的话，那么我们下次切分只要遍历数组 (0~k-1)的元素就行啦，反之如果 k 比 j 大的话，那下次切分只要遍历数组 (k+1～n) 的元素就行啦，总之可以看作每次调用 partition 遍历的元素数目都是上一次遍历的 1/2，因此时间复杂度是 N + N/2 + N/4 + ... + N/N = 2N, 因此时间复杂度是 O(N)。
**最坏情况下**的时间复杂度为 O(n^2)，每次的划分点都是最大值或最小值，一共需要划分 n - 1次，而一次划分需要线性的时间复杂度，所以最坏情况下时间复杂度为 O(n^2)

- **空间复杂度：循环替代递归所以为O(1)。
```javascript
function getLeastNumbers(arr, k) {
    if (k == 0 || arr.length == 0 || k > arr.length) {
        return []
    }
    let len = arr.length;
    let target = k-1;//查找下标为k-1的
    let left = 0;
    let right = len - 1;
    //循环替代了递归
    while (true) {
        let index = partition(arr, left, right);
        if (index < target) {
            left = index + 1;
        } else if (index > target) {
            right = index - 1;
        } else {
            return arr[index];
        }
    }
}
//双指针进行划分
function partition(arr, left, right) {
    // 选择随机数作为标定点
    if (right > left) {
        let randomIndex = left + 1 + parseInt(Math.random()*(right - left));
        [arr[left],arr[randomIndex]] =  [arr[randomIndex],arr[left]]
    }
    let pivot = arr[left];
  	//后续前置++,所以j要加一
    let i = left, j = right + 1;
    while (true) {
        while (++i <= right && arr[i] < pivot);//此处可以变更实现第K大和第K小
        while (--j >= left && arr[j] > pivot);
        if (i >= j) {
            break;
        }
        [arr[j], arr[i]] = [arr[i], arr[j]]
    }
    arr[left] = arr[j];
    arr[j] = pivot;
    return j;
}
```
<a name="oW8SD"></a>
### 堆排序
**思路：**

1. 把前`k`个数构建一个大顶堆
2. 从第`k`个数开始，和大顶堆的最大值进行比较，若比最大值小，交换两个数的位置，重新构建大顶堆
3. 一次遍历之后大顶堆里的数就是整个数据里最小的`k`个数。**

**复杂度分析：**

- 时间复杂度：_O_(_NlogK_)
- 空间复杂度：_O_(_k_)，因为大根堆里最多 _k_ 个数
```javascript
function getLeastNumbers(arr, k) {
    createMaxHeap(arr, k);//此时前K个值已经为最大顶，第一个数是最大值
    //从后往前遍历，每次将最大值和最后一位交换，剩下无序项继续最大堆化
    for (let i = k; i < arr.length; i++) {
        //当前值比最大堆的最大值小
        if (arr[i] < arr[0]) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            max_heapify(arr, 0, k);
        }
    }
    return arr[0];
}
function createMaxHeap(arr, length) {
    let len = length || arr.length;
    //数组的前半段都是父节点，从后往前遍历
    for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
        max_heapify(arr, i, len);
    }
}
function max_heapify(arr, start, end) {
    let dad = start;
    let son = dad * 2 + 1;
    //左子节点超出数组范围，退出，这里的end是数组长度
    if (son >= end) {
        return;
    }
    //如果右节点存在，且右节点>左节点,son加一，最后用大一点的子节点和父节点交换
    if (son + 1 < end && arr[son + 1] > arr[son]) {
        son++;
    }
    //父节点和大一点的子节点交换
    if (arr[dad] <= arr[son]) {
        [arr[dad], arr[son]] = [arr[son], arr[dad]];
        max_heapify(arr, son, end);//继续遍历子节点
    }
}
```
<a name="hr7Jf"></a>
### 数据量特别大的优化
如果把数据看成输入流的话，使用堆的方法是来一个处理一个，不需要保存数据，只需要保存 k 个元素的最大堆。而快速选择的方法需要先保存下来所有的数据，再运行算法。当数据量非常大的时候，甚至内存都放不下的时候，还是用基于堆的方法比较好。<br />
<br />

## 2. 合并二维有序数组成一维有序数组，归并排序的思路
```javascript
const arr = [
    [2, 3, 4],
    [4, 6, 7],
    [5, 9, 23]
]
```
### 思路

- 按照数组首项大小排序
- 然后按照归并排序排序进行排序
- 需要注意的是，划分到最细是两个长度为1的二维数组进行比较，需要降维处理
### 实现
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


