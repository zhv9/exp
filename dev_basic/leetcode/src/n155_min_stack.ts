/*
 * @lc app=leetcode id=155 lang=typescript
 *
 * [155] Min Stack
 */

// @lc code=start
class MinStack {
  stack: Array<number> = [];
  minStack: Array<number> = [+Infinity];

  push(val: number): void {
    this.stack.push(val);
    if (val <= this.getMin()) {
      this.minStack.push(val);
    }
  }

  pop(): void {
    if (this.stack.pop() === this.getMin()) {
      this.minStack.pop();
    }
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
// @lc code=end
