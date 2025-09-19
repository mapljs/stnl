import { describe, expect, test } from 'bun:test';

// Describe a group of tests
describe('Numbers', () => {
  // A single test
  test('Equality', () => {
    // Assert
    expect(1).toBe(1);
  });
});
