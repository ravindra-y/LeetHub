const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('scripts/leetcode.js', 'utf8');
const start = source.indexOf("const leetCodeUsername = 'ravindra-y';");
const end = source.indexOf("const readmeFilename = 'README.md';");
const context = {};
vm.createContext(context);
vm.runInContext(`${source.slice(start, end)}\nthis.buildRepoReadme = buildRepoReadme;`, context);

const readme = context.buildRepoReadme({ solved: 1, acceptanceRate: 50, currentStreak: 1, maxStreak: 1 }, 'ravindra-y');
assert.match(readme, /badge\/LeetCode-ravindra--y-FFA116/);
assert.match(readme, /badge\/GitHub-ravindra--y-181717/);
