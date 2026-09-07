/**
 * Solution 1: Mathematical Formula (Gauss Summation)
 * - Time Complexity: O(1) - Constant time complexity as it uses a single direct math calculation.
 * - Space Complexity: O(1) - Uses a fixed amount of memory regardless of input size.
 * - Pros: Extremely fast performance and optimal resource usage.
 * - Cons: Potential integer overflow issue if `n` is extremely large before division.
 */
var sum_to_n_a = function(n) {
    return (n * (n + 1)) / 2;
};

/**
 * Solution 2: Iterative Loop (For Loop)
 * - Time Complexity: O(n) - Linear time complexity as execution time grows directly with `n`.
 * - Space Complexity: O(1) - Uses a constant memory space for the accumulator variable.
 * - Pros: Simple to read and understand, highly reliable without overflow during intermediate steps.
 * - Cons: Slower performance on large inputs due to running `n` iterations.
 */
var sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

/**
 * Solution 3: Recursion
 * - Time Complexity: O(n) - Requires `n` recursive calls to reach the base condition.
 * - Space Complexity: O(n) - Call stack memory grows proportionally with `n`.
 * - Pros: Elegant, declarative code structure following functional programming principles.
 * - Cons: High risk of Maximum Call Stack Size Exceeded (Stack Overflow) when `n` is large.
 */
var sum_to_n_c = function(n) {
    if (n <= 1) return n;
    return n + sum_to_n_c(n - 1);
};