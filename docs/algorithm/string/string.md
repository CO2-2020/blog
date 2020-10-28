# 字符串问题

### 1. 字符串出现的不重复最长长度
LeetCode[最长不含重复字符的子字符串](https://leetcode-cn.com/problems/zui-chang-bu-han-zhong-fu-zi-fu-de-zi-zi-fu-chuan-lcof/)
```javascript
输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```
#### 思路

- 用一个中间Map来存储不重复子串的信息，值为key，下标为value
- 用两个滑动指针来存储子串的下标
- 右指针向右移动用来判断新的值
- 当遇到已有的值，左指针在移动到新下标的过程中，将其中的值在中间Map全部删除
- 每次循环都需要对比最大子串的大小
#### 实现
```javascript
let lengthOfLongestSubstring = function (str) {
    if(str.length == 1) return 1;
    let l = 0;
    let r = 1;
    let tmp = new Map();
    tmp.set(str[l], l);
    let max = 0;
    while (r < str.length) {
        //存在
        if (tmp.has(str[r])) {
            //从l 一直滑到新l 中间的字符都从中间map中删除
            let index = tmp.get(str[r]);
            while (l <= index) {
                tmp.delete(str[l++]);
            }
        }
        tmp.set(str[r], r);
        r++;
        max = Math.max(max, tmp.size);
    }
    return max;
}
const str = "";
console.log(lengthOfLongestSubstring(str));
```




