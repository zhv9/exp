/*
 * @lc app=leetcode id=66 lang=typescript
 *
 * [66] Plus One
 */

// @lc code=start
function plusOne(digits: number[]): number[] {
  let index = digits.length - 1;
  while (true) {
    if (digits[index] !== 9) {
      digits[index] += 1;
      return digits;
    } else {
      digits[index] = 0;
    }
    if (index === 0) {
      return [1, ...digits];
    }
    index -= 1;
  }
}
// @lc code=end

console.log("[1,2,4]: ", plusOne([1, 2, 3]));
console.log("[1,3,0]: ", plusOne([1, 2, 9]));
console.log("[1,0,0,0]: ", plusOne([9, 9, 9]));
