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

function isChrome() {
  return typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined";
}

function isFirefox() {
  return (
    typeof browser !== "undefined" && typeof browser.runtime !== "undefined"
  );
}
