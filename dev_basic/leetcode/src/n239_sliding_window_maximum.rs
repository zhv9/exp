/*
 * @lc app=leetcode id=239 lang=rust
 *
 * [239] Sliding Window Maximum
 */

/*
1. 首先利用一个双端列队，里面的数据是从大到小。
2. 如果列队里有比当前元素小的，就直接弹出。
3. 如果元素位置之差大于 k 就将队首的弹出，因为最前面的超出窗口了。

方案原理：

1. 这个方案就是把前面 k - 1 个数求了最大值，放在最前面；
2. 每次滑动窗口都会求一次最大值，并放到最前面。
    - 方法就是弹出比当前数小的数，由于列队本身是从大到小排列，所以可以直接从尾部开始比较。
3. 如果当前值小的话，就放入列队，因为这个值虽然没有前面的大，但是可能会比后面的大。
4. 在 i 大于 k - 1 之后，需要每次检查当前数据前面第 k 个数是不是等于列队头部的数据。
   - 如果等于说明填满了一次窗口，需要弹出头部数据了。
   - 然后需要把最大值放入 result
5. 在 i = k - 1 ，也就是完成第一个窗口，的时候开始将列队头部的最大值放入 result
*/

// @lc code=start
use std::collections::VecDeque;

impl Solution {
    pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
        if nums.len() == 0 || k == 1 {
            return nums;
        }
        let mut result: Vec<i32> = Vec::new();
        let mut dequeue: VecDeque<i32> = VecDeque::new();
        for i in 0..nums.len() {
            while !dequeue.is_empty() && *dequeue.back().unwrap() < nums[i] {
                dequeue.pop_back();
            }
            dequeue.push_back(nums[i]);

            if (i as i32) > k - 1 {
                // pop front when first of dequeue is the number k before current item.
                Self::pop_front(&mut dequeue, nums[i - k as usize]);
                // check whether number of items in dequeue is over k
                Self::add_max_in_window(&mut result, &dequeue);
            } else if (i as i32) == k - 1 {
                // if length of nums is less than k then push front at last cycle
                Self::add_max_in_window(&mut result, &dequeue);
            }
        }
        result
    }

    fn add_max_in_window(result: &mut Vec<i32>, dequeue: &VecDeque<i32>) {
        result.push(*dequeue.front().unwrap());
    }

    fn pop_front(dequeue: &mut VecDeque<i32>, num: i32) {
        if !dequeue.is_empty() && *dequeue.front().unwrap() == num {
            dequeue.pop_front();
        }
    }
}
// @lc code=end

struct Solution;

#[cfg(test)]
mod test_max_sliding_window {
    use crate::n239_sliding_window_maximum::Solution;

    #[test]
    fn test() {
        assert_eq!(Solution::max_sliding_window(vec![1], 1), vec![1]);
        assert_eq!(Solution::max_sliding_window(vec![1, -1], 1), vec![1, -1]);
        assert_eq!(Solution::max_sliding_window(vec![9, 11], 2), vec![11]);
        assert_eq!(Solution::max_sliding_window(vec![4, -2], 2), vec![4]);
        assert_eq!(Solution::max_sliding_window(vec![4, 5, 2], 3), vec![5]);
        assert_eq!(
            Solution::max_sliding_window(vec![1, 3, -1, -3, 5, 3, 6, 7], 3),
            vec![3, 3, 5, 5, 6, 7]
        );
        assert_eq!(Solution::max_sliding_window(vec![7, 2, 4], 2), vec![7, 4]);
        assert_eq!(Solution::max_sliding_window(vec![7, 6, 7], 2), vec![7, 7]);
    }
}
