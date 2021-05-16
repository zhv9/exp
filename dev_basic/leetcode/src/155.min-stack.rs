/*
 * @lc app=leetcode id=155 lang=rust
 *
 * [155] Min Stack
 */

// @lc code=start
struct MinStack {
    stack: Vec<i32>,
    min_stack: Vec<i32>,
}

/**
 * `&self` means the method takes an immutable reference.
 * If you need a mutable reference, change it to `&mut self` instead.
 */
impl MinStack {
    /** initialize your data structure here. */
    fn new() -> Self {
        MinStack {
            stack: Vec::new(),
            min_stack: Vec::new(),
        }
    }
    fn push(&mut self, val: i32) {
        self.stack.push(val);
        if self.min_stack.is_empty() || val <= self.get_min() {
            self.min_stack.push(val);
        }
    }
    fn pop(&mut self) {
        // if let Some(value) = self.stack.pop() {
        //     if value == self.get_min() {
        //         self.min_stack.pop();
        //     }
        // }
        match self.stack.pop() {
            Some(value) if value == self.get_min() => self.min_stack.pop(),
            _ => None,
        };
    }
    fn top(&self) -> i32 {
        *self.stack.last().unwrap()
        // if let Some(value) = self.stack.last() {
        //     *value
        // } else {
        //     panic!()
        // }
    }
    fn get_min(&self) -> i32 {
        *self.min_stack.last().unwrap()
        // match self.min_stack.last() {
        //     Some(value) => *value,
        //     _ => panic!(),
        // }
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * let obj = MinStack::new();
 * obj.push(val);
 * obj.pop();
 * let ret_3: i32 = obj.top();
 * let ret_4: i32 = obj.get_min();
 */
// @lc code=end
