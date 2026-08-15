/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./scripts/leetcode/util.js
/** Enum for languages supported by LeetCode. */
const languages = Object.freeze({
  C: '.c',
  'C++': '.cpp',
  'C#': '.cs',
  Dart: '.dart',
  Elixir: '.ex',
  Erlang: '.erl',
  Go: '.go',
  Java: '.java',
  JavaScript: '.js',
  Javascript: '.js',
  Kotlin: '.kt',
  MySQL: '.sql',
  'MS SQL Server': '.sql',
  Oracle: '.sql',
  Pandas: '.py',
  PHP: '.php',
  Python: '.py',
  Python3: '.py',
  Racket: '.rkt',
  Ruby: '.rb',
  Rust: '.rs',
  Scala: '.scala',
  Swift: '.swift',
  TypeScript: '.ts',
});

/** @enum */
const DIFFICULTY = Object.freeze({
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  UNKNOWN: 'Unknown',
});

class LeetHubError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LeetHubErr';
  }
}

function isEmptyObject(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

function assert(truthy, msg) {
  if (!truthy) {
    throw new LeetHubError(msg);
  }
}

/**
 * Returns a function that can be immediately invoked but will start
 * a timeout of 'wait' milliseconds before it can be called again.
 * @param {Function} func to be called after wait
 * @param {number} wait time in ms
 * @param {boolean} invokeBeforeTimeout true if you want to invoke func before waiting
 * @returns {Function}
 */
function debounce(func, wait, invokeBeforeTimeout) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!invokeBeforeTimeout) func.apply(context, args);
    };
    const callNow = invokeBeforeTimeout && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * Delays the execution of a function by the specified time (in milliseconds)
 * and then executes the function with the provided arguments.
 *
 * @param {Function} func - The function to be executed after the delay.
 * @param {number} wait - The number of milliseconds to wait before executing the function.
 * @param {...*} [args] - Additional arguments to pass to the function when it is called.
 * @returns {Promise<*>} A promise that resolves with the result of the function execution.
 */
function delay(func, wait, ...args) {
  return new Promise(resolve => setTimeout(() => resolve(func(...args)), wait));
}

/**
 *
 * @returns {chrome | browser} namespace of browser extension api
 */
function getBrowser() {
  if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') {
    return chrome;
  } else if (typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined') {
    return browser;
  } else {
    throw new LeetHubError('BrowserNotSupported');
  }
}

/**
 * Returns the difficulty in PascalCase for a given difficulty
 * @param {string} difficulty - The difficulty level as a string: "easy", "medium", "hard", etc.
 * @returns {string} - The difficulty level in PascalCase: "Easy", "Medium", or "Hard" or "Unknown" for unrecognized values.
 */
function getDifficulty(difficulty) {
  difficulty &&= difficulty.toUpperCase().trim();
  return DIFFICULTY[difficulty] ?? DIFFICULTY.UNKNOWN;
}

/**
 * Checks if an HTML Collection exists and has elements
 * @param {HTMLCollectionOf<Element>} elem
 * @returns
 */
function checkElem(elem) {
  return elem && elem.length > 0;
}

/** @param {string} string @returns {string} problem slug, e.g. 0001-two-sum */
function convertToSlug(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function addLeadingZeros(title) {
  const maxTitlePrefixLength = 4;
  var len = title.split('-')[0].length;
  if (len < maxTitlePrefixLength) {
    return '0'.repeat(4 - len) + title;
  }
  return title;
}

function formatStats(time, timePercentile, space, spacePercentile) {
  return `Time: ${time} (${timePercentile}%), Space: ${space} (${spacePercentile}%) - LeetHub`;
}

function isObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function mergeDeep(target, source) {
  for (const key in source) {
    if (isObject(source[key])) {
      if (!target[key]) {
        Object.assign(target, { [key]: {} });
      }
      mergeDeep(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
}

function mergeStats(obj1, obj2) {
  function countDifficulties(shas) {
    const difficulties = { easy: 0, medium: 0, hard: 0, solved: 0 };
    for (const problem in shas) {
      if ('difficulty' in shas[problem]) {
        const difficulty = shas[problem].difficulty;
        if (difficulty in difficulties) {
          difficulties[difficulty]++;
        }
      }
    }
    for (let value of Object.values(difficulties)) {
      difficulties.solved += value;
    }
    return difficulties;
  }

  const merged = {};
  mergeDeep(merged, obj1);
  mergeDeep(merged, obj2);

  const shas = merged.shas || {};
  const difficulties = countDifficulties(shas);

  merged.easy = difficulties.easy;
  merged.medium = difficulties.medium;
  merged.hard = difficulties.hard;
  merged.solved = difficulties.solved;

  return merged;
}



;// ./scripts/popup.js


let api = getBrowser()

/**
 * Validate a GitHub Personal Access Token directly against the GitHub API
 * (no third-party server involved) and, if valid, store it locally and
 * kick off onboarding.
 */
const connectToken = async () => {
  const token = $('#token_input').val().trim();
  $('#auth_error').hide();

  if (!token) {
    $('#auth_error').text('Paste a GitHub token first.').show();
    return;
  }

  let res;
  try {
    res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
  } catch (e) {
    $('#auth_error').text('Could not reach GitHub. Check your connection and try again.').show();
    return;
  }

  if (!res.ok) {
    $('#auth_error')
      .text(
        res.status === 401
          ? 'Invalid token. Double check it was copied correctly and has not expired.'
          : `GitHub rejected the token (status ${res.status}).`
      )
      .show();
    return;
  }

  const user = await res.json();

  // Token never leaves this device except to talk to api.github.com directly.
  await api.storage.local.set({ leethub_token: token, leethub_username: user.login });
  $('#token_input').val('');

  const urlOnboarding = api.runtime.getURL('welcome.html');
  api.tabs.create({ url: urlOnboarding, active: true });
  window.close();
};

$('#authenticate').on('click', connectToken);
$('#token_input').on('keydown', e => {
  if (e.key === 'Enter') connectToken();
});

/* Get URL for welcome page */
$('#welcome_URL').attr('href', api.runtime.getURL('welcome.html'));
$('#hook_URL').attr('href', api.runtime.getURL('welcome.html'));
$('#reset_stats').on('click', () => {
  $('#reset_confirmation').show();
  $('#reset_yes').off('click').on('click', () => {
    api.storage.local.set({ stats: null });
    $('#p_solved').text(0);
    $('#p_solved_easy').text(0);
    $('#p_solved_medium').text(0);
    $('#p_solved_hard').text(0);
    $('#reset_confirmation').hide()
  })
  $('#reset_no').off('click').on('click', () => {
    $('#reset_confirmation').hide()
  })
});

api.storage.local.get('leethub_token', data => {
  const token = data.leethub_token;
  if (token === null || token === undefined) {
    $('#auth_mode').show();
  } else {
    // To validate user, load user object from GitHub.
    const AUTHENTICATION_URL = 'https://api.github.com/user';

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          /* Show MAIN FEATURES */
          api.storage.local.get('mode_type', data2 => {
            if (data2 && data2.mode_type === 'commit') {
              $('#commit_mode').show();
              /* Get problem stats and repo link */
              api.storage.local.get(['stats', 'leethub_hook'], data3 => {
                const stats = data3?.stats;
                $('#p_solved').text(stats?.solved ?? 0);
                $('#p_solved_easy').text(stats?.easy ?? 0);
                $('#p_solved_medium').text(stats?.medium ?? 0);
                $('#p_solved_hard').text(stats?.hard ?? 0);
                const leethubHook = data3?.leethub_hook;
                if (leethubHook) {
                  $('#repo_url').html(
                    `<a target="blank" style="color: cadetblue !important; font-size:0.8em;" href="https://github.com/${leethubHook}">${leethubHook}</a>`
                  );
                }
              });
            } else {
              $('#hook_mode').show();
            }
          });
        } else if (xhr.status === 401) {
          // Token is invalid/expired/revoked; clear it and ask the user to reconnect.
          api.storage.local.set({ leethub_token: null }, () => {
            console.log('Stored GitHub token is no longer valid — asking user to reconnect.');
            $('#auth_mode').show();
          });
        }
      }
    });
    xhr.open('GET', AUTHENTICATION_URL, true);
    xhr.setRequestHeader('Authorization', `token ${token}`);
    xhr.send();
  }
});

// Repository organizer -------------------------------------------------------
// The Git data API lets a group of folder moves become one atomic commit. This
// avoids the partial moves produced by the Contents API's one-file-at-a-time
// updates and gives the user a preview before any write happens.
//
// The scan itself (classification + one LeetCode/GitHub round trip per
// folder) now runs in background.js instead of here: this popup's script
// context is torn down by Chrome the moment it loses focus, which used to
// silently kill a scan the instant the user clicked away, with no progress
// shown and no way to resume. Progress is persisted to storage so this popup
// (whenever it happens to be open) can just render whatever state it finds.
const organizerEscape = value => $('<div>').text(value).html();

function renderOrganizerPreview(moves) {
  $('#organizer_preview').html(
    moves
      .map(
        (move, index) =>
          `<label style="display:block; margin:4px 0;"><input type="checkbox" class="organizer_move" data-index="${index}" checked> ${organizerEscape(move.problem)}: ${organizerEscape(move.category)} → <strong>${organizerEscape(move.targetCategory)}</strong><br><span style="margin-left:20px; opacity:.7;">${organizerEscape(move.reason)}</span></label>`
      )
      .join('')
  );
}

function renderOrganizerProgress(progress) {
  if (!progress || !progress.status) return;

  const running = progress.status === 'running';
  $('#scan_repository').prop('hidden', running);
  $('#stop_scan').prop('hidden', !running);
  $('#scan_progress_bar').prop('hidden', !running);

  if (running) {
    const percent = progress.total ? Math.round((progress.checked / progress.total) * 100) : 0;
    $('#scan_progress_fill').css('width', `${percent}%`);
    $('#organizer_status').text(progress.message || 'Scanning…');
    $('#apply_organization').prop('hidden', true);
    return;
  }

  if (progress.status === 'done') {
    $('#organizer_status').text(progress.message);
    if (progress.moves && progress.moves.length) {
      renderOrganizerPreview(progress.moves);
      $('#apply_organization').prop('hidden', false);
    } else {
      $('#organizer_preview').empty();
    }
  } else if (progress.status === 'stopped') {
    $('#organizer_status').text(progress.message || 'Scan stopped.');
  } else if (progress.status === 'error') {
    $('#organizer_status').text(progress.error);
  }
}

$('#organize_repository').on('click', () => $('#organizer_panel').toggle());

$('#scan_repository').on('click', () => {
  $('#organizer_preview').empty();
  $('#apply_organization').prop('hidden', true);
  api.runtime.sendMessage({ type: 'ORGANIZER_SCAN_START' });
});

$('#stop_scan').on('click', () => {
  api.runtime.sendMessage({ type: 'ORGANIZER_SCAN_STOP' });
});

// Live progress while background.js runs the scan, and picking up wherever
// it left off if this popup was closed and reopened mid-scan.
api.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.organizerProgress) {
    renderOrganizerProgress(changes.organizerProgress.newValue);
  }
});
api.storage.local.get('organizerProgress', ({ organizerProgress }) => {
  if (organizerProgress) renderOrganizerProgress(organizerProgress);
});

/** Thin GitHub API helper for applying the selected moves (kept here — applying is fast and needs the live checkbox selection, so there's no benefit to running it in the background). */
async function organizerApiRequest(token, path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`GitHub request failed (${response.status}).`);
  return response.json();
}

$('#apply_organization').on('click', async () => {
  const { organizerScan } = await api.storage.local.get('organizerScan');
  if (!organizerScan) { $('#organizer_status').text('Scan again — no scan results were found.'); return; }
  const selected = $('.organizer_move:checked').map((_, element) => organizerScan.moves[Number(element.dataset.index)]).get();
  if (!selected.length) { $('#organizer_status').text('Select at least one move.'); return; }
  $('#organizer_status').text('Creating one GitHub commit…');
  $('#apply_organization').prop('disabled', true);
  try {
    const changes = selected.flatMap(move => move.files.flatMap(file => {
      const relativePath = file.path.slice(`${move.category}/${move.problem}/`.length);
      return [{ path: `${move.target}/${relativePath}`, mode: file.mode, type: file.type, sha: file.sha }, { path: file.path, mode: file.mode, type: file.type, sha: null }];
    }));
    // Keep LeetHub's path index in stats.json aligned with the folder rename.
    // Without this, a later submission of the same problem could be treated as new.
    const statsEntry = organizerScan.entries.find(entry => entry.path === 'stats.json' && entry.type === 'blob');
    if (statsEntry) {
      const blob = await organizerApiRequest(organizerScan.token, `/repos/${organizerScan.hook}/git/blobs/${statsEntry.sha}`);
      const statsFile = JSON.parse(decodeURIComponent(escape(atob(blob.content.replace(/\n/g, '')))));
      const shas = statsFile?.leetcode?.shas;
      let changedStats = false;
      if (shas) for (const move of selected) {
        const oldPrefix = `${move.category}/${move.problem}`;
        const newPrefix = move.target;
        for (const key of Object.keys(shas)) if (key === oldPrefix || key.startsWith(`${oldPrefix}/`)) {
          shas[`${newPrefix}${key.slice(oldPrefix.length)}`] = shas[key];
          delete shas[key];
          changedStats = true;
        }
      }
      if (changedStats) {
        const statsBlob = await organizerApiRequest(organizerScan.token, `/repos/${organizerScan.hook}/git/blobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: btoa(unescape(encodeURIComponent(JSON.stringify(statsFile)))), encoding: 'base64' }) });
        changes.push({ path: 'stats.json', mode: statsEntry.mode, type: 'blob', sha: statsBlob.sha });
      }
    }
    const newTree = await organizerApiRequest(organizerScan.token, `/repos/${organizerScan.hook}/git/trees`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ base_tree: organizerScan.baseTreeSha, tree: changes }) });
    const newCommit = await organizerApiRequest(organizerScan.token, `/repos/${organizerScan.hook}/git/commits`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Organize ${selected.length} LeetCode solution${selected.length === 1 ? '' : 's'}`, tree: newTree.sha, parents: [organizerScan.parentSha] }) });
    await organizerApiRequest(organizerScan.token, `/repos/${organizerScan.hook}/git/refs/heads/${encodeURIComponent(organizerScan.branch)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sha: newCommit.sha, force: false }) });
    const { stats } = await api.storage.local.get('stats');
    if (stats?.shas) {
      for (const move of selected) {
        const oldPrefix = `${move.category}/${move.problem}`;
        for (const key of Object.keys(stats.shas)) if (key === oldPrefix || key.startsWith(`${oldPrefix}/`)) {
          stats.shas[`${move.target}${key.slice(oldPrefix.length)}`] = stats.shas[key];
          delete stats.shas[key];
        }
      }
      await api.storage.local.set({ stats });
    }
    $('#organizer_status').text(`Done — moved ${selected.length} solution${selected.length === 1 ? '' : 's'} in commit ${newCommit.sha.slice(0, 7)}.`);
    $('#apply_organization').prop('hidden', true);
  } catch (error) { $('#organizer_status').text(`${error.message} Scan again before retrying if the repository changed.`); }
  finally { $('#apply_organization').prop('disabled', false); }
});

/******/ })()
;
