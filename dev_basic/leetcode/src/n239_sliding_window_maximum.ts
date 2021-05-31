/*
 * @lc app=leetcode id=239 lang=typescript
 *
 * [239] Sliding Window Maximum
 */

// @lc code=start
function maxSlidingWindow(nums: number[], k: number): number[] {
  if (nums.length === 0 || k === 1) {
    return nums;
  }

  let result = [];
  let dequeue = [];
  nums.forEach((value, index) => {
    while (dequeue.length !== 0 && dequeue[dequeue.length - 1] < value) {
      dequeue.pop();
    }
    dequeue.push(value);
    if (index > k - 1) {
      if (dequeue[0] === nums[index - k]) {
        dequeue.shift();
      }
      result.push(dequeue[0]);
    } else if (index === k - 1) {
      result.push(dequeue[0]);
    }
  });
  return result;
}
// @lc code=end

function maxSlidingWindow2(nums: number[], k: number): number[] {
  if (nums.length === 0 || k === 1) {
    return nums;
  }

  let result = [];
  let dequeue = [];
  nums.forEach((value, index) => {
    while (dequeue.length !== 0 && dequeue[dequeue.length - 1] < value) {
      dequeue.pop();
    }
    dequeue.push(value);
    if (index >= k - 1) {
      result.push(dequeue[0]);
      // 如果用这种 nums[index - k + 1] 就是在列队中数据达到 k 以后，进入下次循环前先把第一个数弹出。
      // 比如 [5,4,3,2,1] 在 k 为 3 时：
      //  nums[index - k + 1] 的话，在第一次执行到此处时列队是 [5,4,3]，所以需要先执行最大值操作，然后确认是否弹出
      //  nums[index - k] 的话，在第一次执行到此处时列队是 [5,4,3,2]，所以需要先确认是否弹出，然后再求最大值
      if (dequeue[0] === nums[index - k + 1]) {
        dequeue.shift();
      }
    }
  });
  return result;
}

function maxSlidingWindow3(nums: number[], k: number): number[] {
  if (nums.length === 0 || k === 1) {
    return nums;
  }
  let start = 0;
  let end = k;
  let result = [];
  while (end <= nums.length) {
    result.push(Math.max(...nums.slice(start, end)));
    start += 1;
    end += 1;
  }
  return result;
}

import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";

function testMaxSlidingWindow() {
  assertEquals(maxSlidingWindow([1], 1), [1]);
  assertEquals(maxSlidingWindow([1, -1], 1), [1, -1]);
  assertEquals(maxSlidingWindow([9, 11], 2), [11]);
  assertEquals(maxSlidingWindow([4, -2], 2), [4]);
  assertEquals(maxSlidingWindow([4, 5, 2], 3), [5]);
  assertEquals(
    maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3),
    [3, 3, 5, 5, 6, 7]
  );
  assertEquals(maxSlidingWindow([7, 2, 4], 2), [7, 4]);
  assertEquals(maxSlidingWindow([7, 6, 7], 2), [7, 7]);
}

testMaxSlidingWindow();
