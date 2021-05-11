/*
 * @lc app=leetcode id=283 lang=typescript
 *
 * [283] Move Zeroes
 */
// 找出非 0 的值，写入原数组
// 然后再将长度减去非零值的数量的 0 填入末尾

// @lc code=start
/**
 Do not return anything, modify nums in-place instead.
 */
function moveZeroes(nums: number[]): void {
  let indexOfNoneZero = 0;
  let index = 0;
  while (index < nums.length) {
    if (nums[index] !== 0) {
      nums[indexOfNoneZero] = nums[index];
      indexOfNoneZero += 1;
    }
    index += 1;
  }
  while (indexOfNoneZero < nums.length) {
    nums[indexOfNoneZero] = 0;
    indexOfNoneZero += 1;
  }
}
// @lc code=end
