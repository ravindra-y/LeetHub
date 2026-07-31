<div align="center">

# 🚀 LeetHub v3

### ⚡ Your Coding Journey, Auto-Synced to GitHub — Zero Effort, Zero Fuss ⚡

**Solve. Submit. Sync. Repeat.** LeetHub v3 silently ships your accepted solutions from **LeetCode** and **GeeksforGeeks** straight into your GitHub repo — the moment you nail that green checkmark. ✅

<br/>

![Version](https://img.shields.io/badge/version-v3.0.0-blueviolet?style=for-the-badge&logo=semanticrelease&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge&logo=opensourceinitiative&logoColor=white)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange?style=for-the-badge&logo=googlechrome&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

<br/>

⭐ **Star this repo if LeetHub v3 saves you time!** ⭐

</div>

---

## 🎯 Project Overview & Mission

> 🧠 **The Mission:** *Every accepted solution is proof of growth — it deserves a permanent home.*

**LeetHub v3** is a lightweight, **Manifest V3–compliant** Chrome extension built to eliminate the tedious copy-paste ritual between your coding practice and your GitHub portfolio. The moment you get an ✅ **Accepted** verdict on **LeetCode** or **GeeksforGeeks**, LeetHub v3 quietly commits that solution to your connected repository — complete with problem metadata, language, and timestamp.

No manual uploads. No forgotten solutions. No excuses. Just a **beautifully consistent commit history** that recruiters (and future-you) will love scrolling through. 💚

---

## ✨ Key Features

- 🔄 **Auto-Sync Magic** — Detects accepted submissions in real-time and pushes them to GitHub instantly, with zero manual intervention.
- 🛡️ **Manifest V3 Native** — Built from the ground up on Chrome's latest, most secure extension architecture (no legacy background pages, no deprecated APIs).
- 🌐 **Multi-Platform Support** — Works seamlessly across **LeetCode** *and* **GeeksforGeeks**, with more platforms planned on the roadmap.
- 📁 **Smart Repo Organization** — Auto-creates a clean folder structure (`Platform/Problem-Name/solution.ext`) so your repo stays tidy and browsable.
- 🔐 **Secure Local Storage** — Your GitHub token *never* leaves your browser's local storage. **Zero Tracking. Zero Servers. Zero Compromise.**
- 🎨 **Minimal, Distraction-Free UI** — A clean popup that shows sync status at a glance, without cluttering your coding flow.
- ⚡ **Lightweight & Fast** — No bloated background processes; the extension only wakes up when it needs to.

---

## 📦 Interactive Installation Guide

<details>
<summary><strong>🖱️ Click to expand: Install LeetHub v3 Locally (Developer Mode)</strong></summary>

<br/>

Follow these steps to run LeetHub v3 straight from source:

1. 📥 **Clone the repository**
   ```bash
   git clone https://github.com/ravindra-y/LeetHub.git
   cd LeetHub
   ```

2. 📚 **Install dependencies** *(if applicable to your build)*
   ```bash
   npm install
   npm run build
   ```

3. 🌐 **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`

4. 🛠️ **Enable Developer Mode**
   - Toggle the **Developer mode** switch in the top-right corner.

5. 📂 **Load the Unpacked Extension**
   - Click **"Load unpacked"**
   - Select the `dist/` (or root, depending on your build) folder of the cloned repo.

6. 🎉 **Pin It & You're Ready!**
   - Click the puzzle icon in Chrome's toolbar and **pin LeetHub v3** for quick access.

> 💡 **Tip:** After every code pull, remember to hit the **refresh icon** on the extension card in `chrome://extensions/` to load your latest changes!

</details>

---

## 🔑 Setup & Authentication

<details>
<summary><strong>🔐 Click to expand: Generate & Connect Your GitHub Token</strong></summary>

<br/>

LeetHub v3 uses **fine-grained GitHub Personal Access Tokens (PATs)** for the tightest possible permission scoping. Here's how to set yours up:

1. 🌍 Head to **GitHub → Settings → Developer settings → [Fine-grained tokens](https://github.com/settings/personal-access-tokens/new)**

2. 🏷️ **Name your token** — e.g., `leethub-v3-sync`

3. 📅 **Set an expiration date** — 90 days is a good default (you can always regenerate).

4. 📁 **Repository access** — Select **"Only select repositories"** and choose the repo you want LeetHub v3 to sync to.

5. ✅ **Set Permissions:**
   - **Contents** → `Read and write` *(required — this is the only permission LeetHub v3 truly needs!)*

6. 🔘 Click **Generate token** and **copy it immediately** (GitHub won't show it again!).

7. 🧩 **Paste it into LeetHub v3:**
   - Click the LeetHub v3 icon in your Chrome toolbar
   - Paste your token into the **GitHub Token** field
   - Enter your **GitHub username** and **target repository name**
   - Click **Save & Connect** 🔗

> 🔒 ***Secure Local Storage*** — Your token is encrypted and stored **only** inside Chrome's local `storage.local` API — sandboxed to your browser, on your machine. It is *never* transmitted to any third-party server.

</details>

---

## 🕹️ How to Use

Once installed and authenticated, using LeetHub v3 is delightfully simple:

1. 🧩 **Solve a problem** on LeetCode or GeeksforGeeks, just like you always do.
2. ✅ **Submit your solution** and wait for that sweet **"Accepted"** result.
3. 🤖 **LeetHub v3 detects the success** and automatically packages your code + metadata.
4. 📤 **Auto-commit fires off** to your connected GitHub repository — no clicks required!
5. 🔔 **Get a subtle notification** confirming the sync was successful.
6. 📊 **Check your GitHub repo** anytime to see your growing streak of solved problems!

> *"Code today, commit automatically, brag on your portfolio tomorrow."* 😎

---

## 🛡️ Privacy & Security

Your trust matters more than any feature. Here's LeetHub v3's privacy promise:

- 🚫 ***Zero Tracking*** — LeetHub v3 collects **no analytics, no telemetry, and no personal data**. Period.
- 🔐 ***Secure Local Storage*** — Your GitHub token is stored exclusively in your browser's local storage — it never touches an external database.
- 🌐 **No Middleman Servers** — All communication happens **directly between your browser and the GitHub API**. LeetHub v3 has no backend of its own routing your data.
- 👀 **Fully Open Source** — Every line of code is public and auditable. Don't trust, *verify*. 🕵️

> ⚠️ **Reminder:** Treat your GitHub token like a password. Never share it, and regenerate it periodically for maximum security.

---

## 🤝 Contributing Guidelines

Contributions make the open-source world go round — and **LeetHub v3 welcomes all of them**! 🌍

1. 🍴 **Fork** this repository
2. 🌿 **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```
3. 💻 **Make your changes** — keep code clean, commented, and consistent with the existing style.
4. ✅ **Test thoroughly** on both LeetCode and GeeksforGeeks before submitting.
5. 📝 **Commit with a clear message**
   ```bash
   git commit -m "✨ Add: amazing new feature"
   ```
6. 🚀 **Push and open a Pull Request**
   ```bash
   git push origin feature/amazing-new-feature
   ```

> 💬 **Got an idea, bug report, or feature request?** Open an [issue](https://github.com/ravindra-y/LeetHub/issues) — all contributions, big or small, are appreciated!

### 🗺️ Roadmap Ideas
- 🧩 Support for HackerRank & Codeforces
- 📈 In-popup solving statistics dashboard
- 🌙 Dark mode UI

---

## 👨‍💻 Author & License

<div align="center">

Built with 💜 by **[Ravindra](https://github.com/ravindra-y)**

📜 Licensed under the **MIT License** — free to use, modify, and distribute.

<br/>

**If LeetHub v3 leveled up your GitHub streak, consider giving it a ⭐!**

[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/ravindra-y/LeetHub)

</div>

---

<div align="center">

*Made for developers who'd rather solve problems than manage repos.* 🧠✨

</div>
