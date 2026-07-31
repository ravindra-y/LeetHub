/*
 * Content scripts can outlive an extension reload. Resolve runtime at call time
 * so an old script exits instead of calling an API Chrome has invalidated.
 */
function getLiveRuntime() {
  try {
    const runtime =
      (typeof chrome !== 'undefined' && chrome.runtime) ||
      (typeof browser !== 'undefined' && browser.runtime);
    return runtime?.id && typeof runtime.sendMessage === 'function' ? runtime : undefined;
  } catch (_) {
    return undefined;
  }
}

/** Sends a runtime message without letting an invalidated content script reject. */
async function safeRuntimeSendMessage(message) {
  const runtime = getLiveRuntime();
  if (!runtime) return undefined;

  try {
    const response = await runtime.sendMessage(message);
    if (runtime.lastError) {
      console.warn('LeetHub runtime message failed:', runtime.lastError.message);
      return undefined;
    }
    return response;
  } catch (error) {
    if (!/Extension context invalidated/i.test(error?.message || '')) {
      console.warn('LeetHub runtime message failed:', error);
    }
    return undefined;
  }
}
