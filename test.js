/**
 * Finds the highest value in an array of integers
 * @param {number[]} arr - Array of integers
 * @returns {number|null} - The highest value or null if array is empty
 * @throws {Error} - If input is not an array or contains non-numeric values
 */
function findHighestValue(arr) {
  // Input validation
  if (!Array.isArray(arr)) {
    throw new Error("Input must be an array");
  }

  if (arr.length === 0) {
    return null;
  }

  // Use Math.max with spread operator for smaller arrays
  if (arr.length < 100000) {
    // Fast path for smaller arrays
    try {
      return Math.max(...arr);
    } catch (e) {
      // If we hit memory limits with spread, fall back to iterative approach
    }
  }
  // For extremely large arrays, use iterative approach
  let highest = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];

    // Validate that array elements are numbers
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error(
        `Invalid value at index ${i}: ${value}. All elements must be numbers.`
      );
    }

    if (value > highest) {
      highest = value;
    }
  }

  return highest;
}

// Generate a large array of random integers
function generateLargeArray(size) {
    const arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = Math.floor(Math.random() * 1000000); // Random integer between 0 and 999999
    }
    return arr;
}

const largeArray = generateLargeArray(1000000);
console.log(largeArray)
console.log(findHighestValue(largeArray));
// console.log(findHighestValue([1, 2, 3, 4, 5])); // 5