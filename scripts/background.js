const api = isChrome() ? chrome : isFirefox() ? browser : undefined;
const SUBMISSION_RESPONSE_TIMEOUT_MS = 30000;

api.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Allow persistent stats to sync on repo link
    api.storage.local.set({ sync_stats: true });
  }
});

api.runtime.onMessage.addListener(handleMessage);

function handleMessage(request, sender, sendResponse) {
  if (request?.type !== "LEETCODE_SUBMISSION" || sender.tab?.id == null)
    return false;

  const tabId = sender.tab.id;
  let timeoutId;
  const listener = (details) => {
    if (details.tabId !== tabId) return;

    const match = details.url.match(/\/submissions\/(\d+)\//);
    if (!match) return;

    finish({ submissionId: match[1] });
  };
  const finish = (response) => {
    api.webNavigation.onHistoryStateUpdated.removeListener(listener);
    clearTimeout(timeoutId);
    // The sender may have navigated or been invalidated while waiting.
    try {
      sendResponse(response);
    } catch (error) {
      console.warn("LeetHub could not reply to a submission request:", error);
    }
  };

  api.webNavigation.onHistoryStateUpdated.addListener(listener, {
    url: [{ hostSuffix: "leetcode.com" }, { pathContains: "submissions" }],
  });
  // Do not leave a global navigation listener behind if LeetCode never changes route.
  timeoutId = setTimeout(() => finish({}), SUBMISSION_RESPONSE_TIMEOUT_MS);
  return true; // Keeps this Manifest V3 message channel open for the async response.
}

// --- Organize repository: background scan --------------------------------
// This used to run inline in popup.js. Chrome tears down the popup's script
// context the moment it loses focus, so closing the popup (or just clicking
// elsewhere) silently killed an in-progress scan with no way to resume it
// and no record of how far it got. Running it here means the scan survives
// the popup closing; progress is persisted to storage so the popup can show
// live progress (or the last known state) whenever it's open.
let organizerAbort = false;

async function organizerApi(token, path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json", ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`GitHub request failed (${response.status}).`);
  return response.json();
}

async function organizerQuestion(titleSlug) {
  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "query questionData($titleSlug: String!) { question(titleSlug: $titleSlug) { titleSlug topicTags { slug } } }",
      variables: { titleSlug },
    }),
  });
  if (!response.ok) throw new Error(`LeetCode request failed (${response.status}).`);
  const body = await response.json();
  return body.data?.question || null;
}

async function organizerBlobText(token, hook, sha) {
  const blob = await organizerApi(token, `/repos/${hook}/git/blobs/${sha}`);
  return decodeURIComponent(escape(atob(blob.content.replace(/\n/g, ""))));
}

const organizerFolderName = (pattern) => pattern.replace(/\s*\/\s*/g, " - ").replace(/[\\?%*:|"<>]/g, "-").trim();

// Same classification rules that used to live in popup.js, unchanged.
function organizerClassify(topicTags, titleSlug) {
  const tags = new Set((topicTags || []).map((tag) => tag.slug).filter(Boolean));
  const has = (...names) => names.some((name) => tags.has(name));
  const title = (titleSlug || "").toLowerCase();
  const titleHas = (...names) => names.some((name) => title.includes(name));
  if (title === "longest-consecutive-sequence") return "Hash Tables";
  if (title === "design-hashmap") return "Hash Tables";
  if (title === "encode-and-decode-tinyurl") return "Hash Tables";
  if (title === "reorganize-string") return "Hash Tables";
  if (title === "first-unique-character-in-a-string") return "Hash Tables";
  if (title === "minimum-deletions-to-make-character-frequencies-unique") return "Hash Tables";
  if (title === "contains-duplicate-ii") return "Sliding Window - Fixed Size";
  if (title === "best-time-to-buy-and-sell-stock") return "Greedy";
  if (has("binary-search-tree")) return "BST / Ordered Set";
  if (has("trie")) return "Tries";
  if (has("linked-list")) return titleHas("reverse") ? "LinkedList In-place Reversal" : has("two-pointers") ? "Fast and Slow Pointers" : "Linked List";
  if (has("dynamic-programming")) {
    if (has("bitmask")) return "Bitmask DP";
    if (titleHas("digit")) return "Digit DP";
    if (has("matrix")) return "2D Grid DP";
    if (title === "number-of-good-ways-to-split-a-string") return "Hash Tables";
    if (has("string", "string-matching")) return "String DP";
    if (has("tree", "binary-tree", "graph")) return "Tree / Graph DP";
    if (titleHas("stock") || has("game-theory")) return "State Machine DP";
    return "1-D DP";
  }
  if (has("sliding-window")) return titleHas("fixed", "size-k", "k-length") ? "Sliding Window - Fixed Size" : "Sliding Window - Dynamic Size";
  if (has("two-pointers")) return "Two Pointers";
  if (has("prefix-sum")) return "Prefix Sum";
  if (has("monotonic-stack")) return "Monotonic Stack";
  if (has("monotonic-queue")) return "Monotonic Queue";
  if (has("stack")) return "Stacks";
  if (has("queue")) return "Queues";
  if (has("hash-table")) return "Hash Tables";
  if (has("heap-priority-queue")) return titleHas("median") ? "Two Heaps" : titleHas("kth-", "top-k", "k-closest", "k-frequent") ? "Top K Elements" : "Heaps";
  if (has("binary-search")) return "Binary Search";
  if (has("backtracking")) return "Backtracking";
  if (has("topological-sort")) return "Topological Sort";
  if (has("union-find")) return "Union Find";
  if (has("minimum-spanning-tree")) return "Minimum Spanning Tree";
  if (has("shortest-path")) return "Shortest Path";
  if (has("depth-first-search")) return "Depth First Search (DFS)";
  if (has("breadth-first-search")) return "Breadth First Search (BFS)";
  if (has("graph")) return "Depth First Search (DFS)";
  if (has("design")) return "Data Structure Design";
  if (has("greedy")) return "Greedy";
  if (has("segment-tree", "binary-indexed-tree")) return "Binary Indexed Tree / Segment Tree";
  if (has("string-matching", "rolling-hash")) return "String Matching";
  if (has("bit-manipulation")) return "Bit Manipulation";
  if (has("geometry", "math")) return "Maths / Geometry";
  if (has("matrix")) return "Matrix (2D Array)";
  if (has("string")) return "Strings";
  if (has("array")) return "Arrays";
  return null;
}

// Same pattern-sniffing rules that used to live in popup.js, unchanged.
function organizerSolutionPattern(code) {
  const text = code.toLowerCase();
  if (/\^=?|(?:[\w.)\]])\s*[&|]=?\s*(?:[\w.(\[]|\d)|(?:[\w.)\]])\s*(?:<<|>>)\s*(?:[\w.(\[]|\d)|~\s*(?:[\w.(\[]|\d)/.test(text)) return { pattern: "Bit Manipulation", evidence: "bitwise operation" };
  if (/\b(parent|rank|size)\b/.test(text) && /\b(find|union)\s*\(/.test(text)) return { pattern: "Union Find", evidence: "find/union parent structure" };
  if (/\b(segmenttree|buildtree|querytree|updatetree)\b/.test(text)) return { pattern: "Binary Indexed Tree / Segment Tree", evidence: "segment-tree operations" };
  if (/\b(deque|arraydeque)\b/.test(text) && /\b(monotonic|pop_front|pop_back)\b/.test(text)) return { pattern: "Monotonic Queue", evidence: "monotonic deque" };
  if (/\b(stack\b|vector<\s*int\s*>)/.test(text) && /\.top\(\)|\.back\(\)/.test(text) && /\bwhile\b/.test(text)) return { pattern: "Monotonic Stack", evidence: "stack pop loop" };
  if (/\b(priority_queue|heapq|priorityqueue)\b/.test(text)) return { pattern: "Heaps", evidence: "priority queue / heap" };
  if (/\b(minprice|min_price|lowestprice|lowest_price|bestbuy|best_buy)\b/.test(text) && /\b(maxprofit|max_profit)\b/.test(text)) return { pattern: "Greedy", evidence: "running minimum price and maximum profit" };
  if (/\b(mid|middle)\b/.test(text) && /\b(left|right|low|high)\b/.test(text) && /\bwhile\b/.test(text)) return { pattern: "Binary Search", evidence: "midpoint search bounds" };
  if (/\b(queue|arraydeque)\b/.test(text) && /\bwhile\b/.test(text) && /\b(pop|poll|dequeue)\b/.test(text)) return { pattern: "Breadth First Search (BFS)", evidence: "queue traversal loop" };
  if (/\bdfs\s*\(/.test(text) && /\bdfs\s*\([^)]*\).*\bdfs\s*\(/s.test(text)) return { pattern: "Depth First Search (DFS)", evidence: "recursive DFS" };
  return null;
}

async function organizerSetProgress(patch) {
  const { organizerProgress } = await api.storage.local.get("organizerProgress");
  await api.storage.local.set({ organizerProgress: { ...(organizerProgress || {}), ...patch } });
}

async function runOrganizerScan() {
  organizerAbort = false;
  await organizerSetProgress({ status: "running", checked: 0, total: 0, found: 0, moves: null, error: null, message: "Reading repository structure…" });
  try {
    const { leethub_token: token, leethub_hook: hook } = await api.storage.local.get(["leethub_token", "leethub_hook"]);
    if (!token || !hook) throw new Error("Connect a GitHub token and repository before organizing.");

    const repo = await organizerApi(token, `/repos/${hook}`);
    const ref = await organizerApi(token, `/repos/${hook}/git/ref/heads/${encodeURIComponent(repo.default_branch)}`);
    const commit = await organizerApi(token, `/repos/${hook}/git/commits/${ref.object.sha}`);
    const tree = await organizerApi(token, `/repos/${hook}/git/trees/${commit.tree.sha}?recursive=1`);

    const folders = new Map();
    for (const entry of tree.tree.filter((entry) => entry.type === "blob")) {
      const [category, problem] = entry.path.split("/");
      if (!category || !problem || !/^\d+-[a-z0-9-]+$/i.test(problem)) continue;
      const key = `${category}/${problem}`;
      if (!folders.has(key)) folders.set(key, { category, problem, files: [] });
      folders.get(key).files.push(entry);
    }
    const folderList = [...folders.values()];
    await organizerSetProgress({ total: folderList.length });

    const moves = [];
    let checked = 0;
    for (const folder of folderList) {
      if (organizerAbort) {
        await organizerSetProgress({ status: "stopped", message: "Stopped by user." });
        return;
      }

      const slug = folder.problem.replace(/^\d+-/, "");
      const question = await organizerQuestion(slug);
      if (question) {
        const codeFile = folder.files.find((file) => /\.(c|cc|cpp|cs|go|java|js|kt|php|py|rb|rs|scala|swift|ts)$/i.test(file.path));
        let implementation;
        if (codeFile) {
          try {
            implementation = organizerSolutionPattern(await organizerBlobText(token, hook, codeFile.sha));
          } catch (_) {
            // A code read failure falls back to the official problem tags.
          }
        }
        const targetCategory = implementation?.pattern || organizerClassify(question.topicTags, question.titleSlug);
        if (targetCategory && organizerFolderName(targetCategory) !== folder.category) {
          const target = `${organizerFolderName(targetCategory)}/${folder.problem}`;
          const conflict = tree.tree.some((entry) => entry.path === target || entry.path.startsWith(`${target}/`));
          if (!conflict) {
            moves.push({ ...folder, targetCategory: organizerFolderName(targetCategory), target, reason: implementation ? `solution pattern: ${implementation.evidence}` : "LeetCode topic tags" });
          }
        }
      }

      checked++;
      await organizerSetProgress({ checked, found: moves.length, message: `Checking ${folder.problem}… (${moves.length} correction${moves.length === 1 ? "" : "s"} found)` });
    }

    await api.storage.local.set({
      organizerScan: { token, hook, branch: repo.default_branch, parentSha: ref.object.sha, baseTreeSha: commit.tree.sha, entries: tree.tree, moves },
    });
    await organizerSetProgress({
      status: "done",
      moves,
      message: moves.length ? `${moves.length} safe move${moves.length === 1 ? "" : "s"} ready. No change has been made yet.` : "Everything scanned is already in the expected folder.",
    });
  } catch (error) {
    await organizerSetProgress({ status: "error", error: error.message });
  }
}

api.runtime.onMessage.addListener((request) => {
  if (request?.type === "ORGANIZER_SCAN_START") {
    runOrganizerScan();
    return false;
  }
  if (request?.type === "ORGANIZER_SCAN_STOP") {
    organizerAbort = true;
    return false;
  }
});

function isChrome() {
  return typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined";
}

function isFirefox() {
  return (
    typeof browser !== "undefined" && typeof browser.runtime !== "undefined"
  );
}
