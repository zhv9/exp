/*
 * @lc app=leetcode id=20 lang=typescript
 *
 * [20] Valid Parentheses
 */

// @lc code=start
const pair = {
  "(": ")",
  "[": "]",
  "{": "}",
};
function isValid(s: string): boolean {
  let stack = [];
  s.split("").forEach((char) => {
    if (stack[stack.length - 1] === char) {
      stack.pop();
    } else {
      stack.push(pair[char]);
    }
  }, []);
  return stack.length === 0;
}
// @lc code=end

console.log("()[]{} should true", isValid("()[]{}"));
console.log("(] should false", isValid("(]"));
console.log("{[]} should true", isValid("{[]}"));
console.log("([)] should false", isValid("([)]"));
console.log("{[(]}) should false", isValid("{[(]})"));
