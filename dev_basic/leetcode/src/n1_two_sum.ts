/*
 * @lc app=leetcode id=1 lang=typescript
 *
 * [1] Two Sum
 */

// @lc code=start
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  let result: number[] = [];
  nums.some((value, index) => {
    const complement = map.get(target - value);
    if (complement !== undefined) {
      result = [complement, index];
      return true;
    }
    map.set(value, index);
  });
  return result;
}
// @lc code=end

import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";

function testTwoSum() {
  assertEquals(twoSum([2, 7, 11, 15], 9), [0, 1]);
  assertEquals(twoSum([3, 2, 4], 6), [1, 2]);
  assertEquals(twoSum([2, 7, 11, 15], 9), [0, 1]);
  assertEquals(twoSum([3, 3], 6), [0, 1]);
}

testTwoSum();
