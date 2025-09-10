# Mini ChatGPT Ultra (Electron)

A tiny **Electron wrapper** for ChatGPT — focused, minimal, distraction-free.  

- Loads **only ChatGPT** (no extra tabs, toolbars, or plugins).  
- **Shows PoW difficulty** in the window title bar.  
- **Supports per-app HTTP proxy** via environment variables.  
- Hides all browser chrome; clean and resizable window.  

---

## Prereqs
- **Node.js LTS** (v20+ recommended). Download from [nodejs.org](https://nodejs.org) and install.  
- Windows 10/11 (portable build available for colleagues).  

---

## Quick Start (for developers)
1. Clone or unzip this folder.  
2. Open a terminal **in this folder** and run:  
   ```bash
   npm install
   npm start
   ```  
3. First launch may ask you to log in to ChatGPT — that’s expected.  

---

## For Colleagues (portable .exe)
If you received a pre-built `.exe` (portable version):  
- Just double-click to run.  
- Login with your ChatGPT account as usual.  
- Title bar will always show current PoW value.  

---

## Optional: Proxy Setup (Windows GUI way)
If your network requires a proxy to access ChatGPT:  
1. Open **Start → Search “Environment Variables” → Edit system environment variables**.  
2. In the dialog, click **Environment Variables…**.  
3. Under **User variables**, click **New…**  
   - Variable name: `MCD_HTTP_PROXY`  
   - Variable value: `http://127.0.0.1:7890` (replace with your proxy address).  
4. Save and restart the program.  

---

## Change Target URL
Developers can edit `main.js` to change the target URL (default is `https://chatgpt.com/`).  

---

## Notes
- External links open in your default browser.  
- This is intentionally minimal; no settings UI and no extra features.  
- If the page stays blank, check the proxy or firewall rules.  
- **Non-official tool**: all content and login go through the official ChatGPT site.  
