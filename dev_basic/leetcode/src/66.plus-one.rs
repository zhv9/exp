/*
 * @lc app=leetcode id=66 lang=rust
 *
 * [66] Plus One
 */

// @lc code=start
impl Solution {
    pub fn plus_one(mut digits: Vec<i32>) -> Vec<i32> {
        let mut index = digits.len() - 1;
        loop {
            if digits[index] != 9 {
                digits[index] += 1;
                return digits;
            } else {
                digits[index] = 0;
            }
            if index == 0 {
                digits.insert(0, 1);
                return digits;
            }
            index -= 1;
        }
    }
}
// @lc code=end

struct Solution;

fn main() {
    println!("{:?} should be [1,2,4]", Solution::plus_one(vec![1, 2, 3]));
    println!("{:?} should be [1,3,0]", Solution::plus_one(vec![1, 2, 9]));
    println!(
        "{:?} should be [1,0,0,0]",
        Solution::plus_one(vec![9, 9, 9])
    );
}
