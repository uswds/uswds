const assert = require("assert");
const { generateDynamicRegExp } = require("../index");

describe('generateDynamicRegExp', () => {
  const extras = {
    key1: 'someRegex',
    key2: 'anotherRegex',
    query: 'searchTerm',
  };

  it('should return a RegExp that matches the query', () => {
    const filter = '{{query}}';
    const query = 'apple';
    const regex = generateDynamicRegExp(filter, query, extras);
    assert.strictEqual(regex.test('apple'), true);
    assert.strictEqual(regex.test('banana'), false);
  });

  it('should escape special characters in the query', () => {
    const filter = '{{query}}';
    const query = 'hello.*';
    const regex = generateDynamicRegExp(filter, query, extras);
    assert.strictEqual(regex.test('hello.*'), true);
    assert.strictEqual(regex.test('hello'), false);
  });

  it('should return an anchored regex for the query when no extras match', () => {
    const filter = '{{nonExistentKey}}';
    const query = 'xyz';
    const regex = generateDynamicRegExp(filter, query, extras);
    assert.strictEqual(regex.test('xyz'), true);
    assert.strictEqual(regex.test('abcxyz'), false);
  });

  it('should handle an empty query gracefully', () => {
    const filter = '{{query}}';
    const query = '';
    const regex = generateDynamicRegExp(filter, query, extras);
    assert.strictEqual(regex.test('anything'), true); // Empty query should match everything
  });

  it('should return a case-insensitive regex', () => {
    const filter = '{{query}}';
    const query = 'apple';
    const regex = generateDynamicRegExp(filter, query, extras);
    assert.strictEqual(regex.test('APPLE'), true);
  });

  it('should match empty string in filter correctly', () => {
    const filter = '{{query}}';
    const query = ' ';
    const regex = generateDynamicRegExp(filter, query, extras);
    assert.strictEqual(regex.test(' '), true);
    assert.strictEqual(regex.test('a'), false);
  });

  it('should not modify the original filter string', () => {
    const filter = '{{query}}';
    const query = 'test';
    const regex = generateDynamicRegExp(filter, query, extras);
    assert.strictEqual(filter, '{{query}}'); // Ensure original filter remains unchanged
  });
});
