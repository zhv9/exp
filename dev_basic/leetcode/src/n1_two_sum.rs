/*
* @lc app=leetcode id=1 lang=rust
*
* [1] Two Sum
*/

// @lc code=start
use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut map: HashMap<i32, usize> = HashMap::new();
        // for index in 0..nums.len() {
        //     map.insert(nums[index], index);
        // }
        // for index in 0..nums.len() {
        //     // the complement is the result that wanted in the vec
        //     let complement = target - nums[index];
        //     // check whether complement in the vec
        //     if map.contains_key(&complement) && map[&complement] != index {
        //         return vec![index as i32, map[&complement] as i32];
        //     }
        // }

        // for index in 0..nums.len() {
        //     let complement = target - nums[index];
        //     if map.contains_key(&complement) {
        //         // The elements in map are all before index, so index need to be second
        //         return vec![map[&complement] as i32, index as i32];
        //     }
        //     map.insert(nums[index], index);
        // }

        for (i, &num) in nums.iter().enumerate() {
            if let Some(value) = map.get(&(target - num)) {
                return vec![*value as i32, i as i32];
            }
            map.insert(num, i);
        }
        vec![]
    }
}
// @lc code=end

struct Solution;

#[test]
fn test() {
    assert_eq!(Solution::two_sum(vec![2, 7, 11, 15], 9), vec![0, 1]);
    assert_eq!(Solution::two_sum(vec![3, 2, 4], 6), vec![1, 2]);
    assert_eq!(Solution::two_sum(vec![2, 7, 11, 15], 9), vec![0, 1]);
    assert_eq!(Solution::two_sum(vec![3, 3], 6), vec![0, 1]);
}
