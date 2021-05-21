/*
 * @lc app=leetcode id=20 lang=rust
 *
 * [20] Valid Parentheses
 */

// @lc code=start
impl Solution {
    pub fn is_valid(s: String) -> bool {
        let mut stack: Vec<char> = vec![];
        for c in s.chars() {
            if stack.is_empty() || *stack.last().unwrap() != c {
                match c {
                    '(' => stack.push(')'),
                    '[' => stack.push(']'),
                    '{' => stack.push('}'),
                    _ => return false,
                }
            } else {
                stack.pop();
            }
        }
        stack.is_empty()
    }
}
// @lc code=end

struct Solution;

#[test]
fn test_parentheses() {
    assert_eq!(Solution::is_valid("()[]{}".into()), true);
    assert_eq!(Solution::is_valid("(]".into()), false);
    assert_eq!(Solution::is_valid("{[]}".into()), true);
    assert_eq!(Solution::is_valid("([)]".into()), false);
    assert_eq!(Solution::is_valid("{[(]})".into()), false);
    assert_eq!(Solution::is_valid("]".into()), false);
}
