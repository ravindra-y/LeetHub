(() => {
  'use strict';

  /* Enum for languages supported by GeeksForGeeks.
   * NOTE: this used to reference `languages`, a global defined only inside
   * leetcode.js's bundle (which never loads on practice.geeksforgeeks.org).
   * That made every call to findGfgLanguage() throw ReferenceError, which in
   * turn meant GFG submissions were silently never uploaded at all. */
  const gfgLanguages = {
    'C++14': '.cpp',
    'C++17': '.cpp',
    'C++': '.cpp',
    C: '.c',
    Java: '.java',
    Python3: '.py',
    Python: '.py',
    Javascript: '.js',
    JavaScript: '.js',
    'C#': '.cs',
  };

  /* Commit messages */
  const README_MSG = 'Create README - LeetHub';
  const SUBMIT_MSG = 'Added solution - LeetHub';
  const UPDATE_MSG = 'Updated solution - LeetHub';
  let START_MONITOR = true;

  const toKebabCase = (string) => {
    return string
      .replace(/[^a-zA-Z0-9\. ]/g, '') // remove special chars
      .replace(/([a-z])([A-Z])/g, '$1-$2') // get all lowercase letters that are near to uppercase ones
      .replace(/[\s_]+/g, '-') // replace all spaces and low dash
      .toLowerCase(); // convert to lower case
  };

  function getBrowserApi() {
    if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') return chrome;
    if (typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined') return browser;
    throw new Error('BrowserNotSupported');
  }
  const gfgApi = getBrowserApi();

  const getPath = (problem, filename) => (filename ? `${problem}/${filename}` : problem);
  /** Encodes a UTF-8 string into base64, mirroring leetcode.js's `encode`. */
  const encode = (data) => btoa(unescape(encodeURIComponent(data)));
  /** Decodes a base64 string into UTF-8, mirroring leetcode.js's `decode`. */
  const decode = (data) => decodeURIComponent(escape(atob(data)));

  function findGfgLanguage() {
    const ele = document.getElementsByClassName('divider text')[0]
      .innerText;
    const lang = ele.split('(')[0].trim();
    if (lang.length > 0 && gfgLanguages[lang]) {
      return gfgLanguages[lang];
    }
    return null;
  }

  function findTitle() {
    const ele = document.querySelector('[class^="problems_header_content__title"] > h3')
      .innerText;
    if (ele != null) {
      return ele;
    }
    return '';
  }

  function findDifficulty() {
    const ele = document.querySelectorAll('[class^="problems_header_description"]')[0].children[0].innerText;

    if (ele != null) {
      if (ele.trim() == 'Basic' || ele.trim() === 'School') {
        return 'Easy';
      }
      return ele;
    }
    return '';
  }

  function getProblemStatement() {
    const ele = document.querySelector('[class^="problems_problem_content"]');
    return `${ele.outerHTML}`;
  }

  function getCode() {

    const scriptContent = `
    var editor = ace.edit("ace-editor");
    var editorContent = editor.getValue();
    var para = document.createElement("pre");
    para.innerText+=editorContent;
    para.setAttribute("id","codeDataLeetHub")
    document.body.appendChild(para);
    `;

    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(scriptContent));
    (
      document.body ||
      document.head ||
      document.documentElement
    ).appendChild(script);
    const text = document.getElementById('codeDataLeetHub').innerText;

    const nodeDeletionScript = `
    document.body.removeChild(para)
    `;
    var script = document.createElement('script');
    script.id = 'tmpScript';
    script.appendChild(document.createTextNode(nodeDeletionScript));
    (
      document.body ||
      document.head ||
      document.documentElement
    ).appendChild(script);

    return text || '';
  }

  /** Returns GitHub data for the file at `${directory}/${filename}`. Mirrors leetcode.js's getGitHubFile. */
  async function getGitHubFile(token, hook, directory, filename) {
    const path = getPath(directory, filename);
    const res = await fetch(`https://api.github.com/repos/${hook}/contents/${path}`, {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!res.ok) throw new Error(String(res.status));
    return res;
  }

  /** Uploads content to GitHub and records the new sha in local stats. Mirrors leetcode.js's `upload`. */
  async function uploadToGitHub(token, hook, content, problem, filename, sha, message) {
    const path = getPath(problem, filename);
    const res = await fetch(`https://api.github.com/repos/${hook}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({ message, content, sha }),
    });
    if (!res.ok) throw new Error(String(res.status));

    const body = await res.json();

    const { stats } = await gfgApi.storage.local.get('stats');
    const nextStats = stats && !isEmptyStats(stats) ? stats : { shas: {}, solved: 0, easy: 0, medium: 0, hard: 0 };
    if (!nextStats.shas[problem]) nextStats.shas[problem] = {};
    nextStats.shas[problem][filename] = body.content.sha;
    await gfgApi.storage.local.set({ stats: nextStats });

    return body.content.sha;
  }

  function isEmptyStats(stats) {
    for (const key in stats) if (Object.hasOwn(stats, key)) return false;
    return true;
  }

  /**
   * Uploads to GitHub with a short retry-on-409 loop, since GitHub's Contents
   * API can race when a file is created/updated in quick succession.
   */
  async function uploadWithRetry(content, problem, filename, message) {
    const { leethub_token, mode_type, leethub_hook, stats } = await gfgApi.storage.local.get([
      'leethub_token',
      'mode_type',
      'leethub_hook',
      'stats',
    ]);

    if (!leethub_token) throw new Error('LeethubTokenUndefined');
    if (mode_type !== 'commit') throw new Error('LeetHubNotAuthorizedByGit');
    if (!leethub_hook) throw new Error('NoRepoDefined');

    let sha = stats?.shas?.[problem]?.[filename] ?? '';

    let lastError;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        return await uploadToGitHub(leethub_token, leethub_hook, content, problem, filename, sha, message);
      } catch (err) {
        if (err.message !== '409') throw err;
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
        try {
          const data = await getGitHubFile(leethub_token, leethub_hook, problem, filename).then((r) => r.json());
          sha = data.sha;
        } catch (lookupErr) {
          if (lookupErr.message !== '404') throw lookupErr;
          sha = '';
        }
      }
    }
    throw lastError;
  }

  const gfgLoader = setInterval(() => {
    let code = null;
    let problemStatement = null;
    let title = null;
    let language = null;
    let difficulty = null;

    if (
      window.location.href.includes(
        'practice.geeksforgeeks.org/problems',
      )
    ) {

      const submitBtn = document.evaluate(".//button[text()='Submit']", document.body, null, XPathResult.ANY_TYPE, null).iterateNext();
      if (!submitBtn) return;

      submitBtn.addEventListener('click', function () {
        START_MONITOR = true;
        const submission = setInterval(() => {
          const output = document.querySelectorAll('[class^="problems_content"]')[0]
            ?.innerText;
          if (
            output &&
            output.includes('Problem Solved Successfully') &&
            START_MONITOR
          ) {
            // clear timeout
            START_MONITOR = false;
            clearInterval(gfgLoader);
            clearInterval(submission);
            // get data
            title = findTitle().trim();
            difficulty = findDifficulty();
            problemStatement = getProblemStatement();
            code = getCode();
            language = findGfgLanguage();

            // format data
            const probName = `${title} - GFG`;

            problemStatement = `# ${title}\n## ${difficulty}\n${problemStatement}`;

            // if language was found
            if (language !== null) {
              const fileName = toKebabCase(title + language);

              uploadWithRetry(encode(problemStatement), probName, 'README.md', README_MSG).catch((err) =>
                console.warn('LeetHub: failed to upload GFG README', err)
              );

              if (code !== '') {
                setTimeout(function () {
                  uploadWithRetry(encode(code), probName, fileName, SUBMIT_MSG).catch((err) =>
                    console.warn('LeetHub: failed to upload GFG solution', err)
                  );
                }, 1000);
              }
            }
          } else if (output && output.includes('Compilation Error')) {
            // clear timeout and do nothing
            clearInterval(submission);
          } else if (
            !START_MONITOR &&
            output &&
            (output.includes('Compilation Error') ||
              output.includes('Correct Answer'))
          ) {
            clearInterval(submission);
          }
        }, 1000);
      });
    }
  }, 1000);
})();
