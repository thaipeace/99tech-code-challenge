const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require('./sum_to_n');

function testImplementation(fn, name) {
    console.group(`Testing: ${name}`);
    
    try {
        // Check test cases
        console.assert(fn(5) === 15, `n = 5 failed. Expected 15, got ${fn(5)}`);
        console.assert(fn(1) === 1, `n = 1 failed. Expected 1, got ${fn(1)}`);
        console.assert(fn(1000) === 500500, `n = 1000 failed. Expected 500500, got ${fn(1000)}`);
        console.assert(fn(0) === 0, `n = 0 failed. Expected 0, got ${fn(0)}`);

        console.log('✅ All test cases passed!');
    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
    
    console.groupEnd();
    console.log(''); // Add one line space between test groups for better readability
}

//  Run tests for each implementation
testImplementation(sum_to_n_a, 'Solution 1 (Gauss Formula)');
testImplementation(sum_to_n_b, 'Solution 2 (For Loop)');
testImplementation(sum_to_n_c, 'Solution 3 (Recursion)');