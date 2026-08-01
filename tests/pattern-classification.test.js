const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('scripts/leetcode.js', 'utf8');
const patterns = source.slice(source.indexOf(';// ./scripts/leetcode/patterns.js'), source.indexOf(';// ./scripts/leetcode/leetcode.js'));
const context = {};
vm.createContext(context);
vm.runInContext(`${patterns}\nthis.getPatternFolder = getPatternFolder;`, context);

const tags = [{ slug: 'array' }, { slug: 'binary-search' }, { slug: 'bit-manipulation' }];
assert.equal(context.getPatternFolder(tags, 'missing-number', 'answer ^= number;'), 'Bit Manipulation');
assert.equal(context.getPatternFolder(tags, 'missing-number', 'while (left <= right) { const mid = (left + right) / 2; }'), 'Binary Search');
