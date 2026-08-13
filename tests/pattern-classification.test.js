const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("scripts/leetcode.js", "utf8");
const patterns = source.slice(
  source.indexOf("// ./scripts/leetcode/patterns.js") +
    "// ./scripts/leetcode/patterns.js".length,
  source.indexOf("// ./scripts/leetcode/leetcode.js"),
);
const context = {};
vm.createContext(context);
vm.runInContext(
  `${patterns}\nthis.getPatternFolder = getPatternFolder;`,
  context,
);

const tags = [
  { slug: "array" },
  { slug: "binary-search" },
  { slug: "bit-manipulation" },
];
assert.equal(
  context.getPatternFolder(tags, "missing-number", "answer ^= number;"),
  "Bit Manipulation",
);
assert.equal(
  context.getPatternFolder(
    tags,
    "missing-number",
    "while (left <= right) { const mid = (left + right) / 2; }",
  ),
  "Binary Search",
);
assert.equal(
  context.getPatternFolder(
    [{ slug: "design" }, { slug: "hash-table" }, { slug: "linked-list" }],
    "design-hashmap",
  ),
  "Hash Tables",
);
assert.equal(
  context.getPatternFolder(
    [{ slug: "design" }, { slug: "hash-table" }],
    "encode-and-decode-tinyurl",
  ),
  "Hash Tables",
);
assert.equal(
  context.getPatternFolder(
    [{ slug: "string" }, { slug: "queue" }, { slug: "hash-table" }],
    "first-unique-character-in-a-string",
  ),
  "Hash Tables",
);
assert.equal(
  context.getPatternFolder(
    [{ slug: "array" }, { slug: "hash-table" }, { slug: "math" }],
    "number-of-good-pairs",
  ),
  "Hash Tables",
);
assert.equal(
  context.getPatternFolder(
    [{ slug: "array" }, { slug: "hash-table" }, { slug: "sliding-window" }],
    "contains-duplicate-ii",
  ),
  "Sliding Window - Fixed Size",
);
assert.equal(
  context.getPatternFolder(
    [
      { slug: "hash-table" },
      { slug: "string" },
      { slug: "greedy" },
      { slug: "sorting" },
      { slug: "heap-priority-queue" },
      { slug: "counting" },
    ],
    "reorganize-string",
  ),
  "Hash Tables",
);

const popup = fs.readFileSync("scripts/popup.js", "utf8");
const organizer = popup.slice(
  popup.indexOf("const organizerClassify"),
  popup.indexOf("const organizerApi"),
);
vm.runInContext(
  `${organizer}\nthis.organizerClassify = organizerClassify;`,
  context,
);
assert.equal(
  context.organizerClassify(
    [{ slug: "design" }, { slug: "hash-table" }, { slug: "linked-list" }],
    "design-hashmap",
  ),
  "Hash Tables",
);
assert.equal(
  context.organizerClassify(
    [{ slug: "design" }, { slug: "hash-table" }],
    "encode-and-decode-tinyurl",
  ),
  "Hash Tables",
);
assert.equal(
  context.organizerClassify(
    [{ slug: "string" }, { slug: "queue" }, { slug: "hash-table" }],
    "first-unique-character-in-a-string",
  ),
  "Hash Tables",
);
assert.equal(
  context.organizerClassify(
    [{ slug: "array" }, { slug: "hash-table" }, { slug: "math" }],
    "number-of-good-pairs",
  ),
  "Hash Tables",
);
assert.equal(
  context.organizerClassify(
    [{ slug: "array" }, { slug: "hash-table" }, { slug: "sliding-window" }],
    "contains-duplicate-ii",
  ),
  "Sliding Window - Fixed Size",
);
assert.equal(
  context.organizerClassify(
    [
      { slug: "hash-table" },
      { slug: "string" },
      { slug: "greedy" },
      { slug: "sorting" },
      { slug: "heap-priority-queue" },
      { slug: "counting" },
    ],
    "reorganize-string",
  ),
  "Hash Tables",
);
