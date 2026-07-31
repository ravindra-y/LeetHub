const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const warnings = [];
const context = {
  console: { warn: (...args) => warnings.push(args) },
  chrome: { runtime: { id: 'test-extension', sendMessage: async () => ({ submissionId: '42' }) } },
};
vm.createContext(context);
vm.runInContext(fs.readFileSync('scripts/runtime.js', 'utf8'), context);

(async () => {
  assert.deepEqual(await context.safeRuntimeSendMessage({ type: 'LEETCODE_SUBMISSION' }), { submissionId: '42' });
  context.chrome.runtime.sendMessage = async () => {
    throw new Error('Extension context invalidated.');
  };
  assert.equal(await context.safeRuntimeSendMessage({ type: 'LEETCODE_SUBMISSION' }), undefined);
  assert.equal(warnings.length, 0);
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
