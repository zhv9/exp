/*
 * @lc app=leetcode id=283 lang=rust
 *
 * [283] Move Zeroes
 */

// @lc code=start
impl Solution {
    pub fn move_zeroes(nums: &mut Vec<i32>) {
        let mut index_of_none_zero = 0;
        for index in 0..nums.len() {
            if nums[index] != 0 {
                nums.swap(index_of_none_zero, index);
                index_of_none_zero += 1;
            }
        }
    }
}
// @lc code=end

struct Solution;

fn main() {
    let mut nums: Vec<i32> = vec![0, 1, 0, 3, 12];
    Solution::move_zeroes(&mut nums);
    println!("{:?} should be [1,3,12,0,0]", nums);
}
