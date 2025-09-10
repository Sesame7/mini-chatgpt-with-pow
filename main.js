const { app, BrowserWindow } = require('electron');
const path = require('path');

const CHATGPT_URL = 'https://chatgpt.com';

const proxy = process.env.MCD_HTTP_PROXY || process.env.HTTP_PROXY || process.env.http_proxy;
if (proxy) app.commandLine.appendSwitch('proxy-server', proxy);

function createWindow() {
  let lastPow = '…';
  let pageTitle = 'ChatGPT';

  const composeTitle = () => {
    const base = pageTitle.replace(/\s—\sPoW:.*$/, '');
    return `${base} — PoW: ${lastPow}`;
  };

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: composeTitle(),
    webPreferences: { contextIsolation: true, preload: path.join(__dirname, 'preload.js') }
  });

  win.removeMenu();

  if (process.env.OPEN_DEVTOOLS === '1') {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  win.on('page-title-updated', (event, title) => {
    event.preventDefault();
    pageTitle = title || 'ChatGPT';
    win.setTitle(composeTitle());
  });

  const dbg = win.webContents.debugger;
  try { dbg.attach(); } catch { }

  dbg.sendCommand('Network.enable').catch(() => { });
  const target = /\/backend-api\/sentinel\/chat-requirements(?:\?|$)/i;
  const reqUrl = new Map(); // requestId -> url

  dbg.on('message', async (_e, method, params) => {
    if (method === 'Network.requestWillBeSent') {
      if (params.type === 'XHR' || params.type === 'Fetch') {
        reqUrl.set(params.requestId, params.request.url);
      }
    }
    if (method === 'Network.loadingFinished') {
      const url = reqUrl.get(params.requestId);
      if (!url || !target.test(url)) return;
      try {
        const { body, base64Encoded } = await dbg.sendCommand('Network.getResponseBody', { requestId: params.requestId });
        const raw = base64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body;
        const json = JSON.parse(raw);
        const pow = json?.proofofwork?.difficulty ?? json?.proofOfWork?.difficulty;
        if (pow !== undefined) {
          lastPow = String(pow);
          win.setTitle(composeTitle());
        }
      } catch { }
      finally { reqUrl.delete(params.requestId); }
    }
    if (method === 'Network.loadingFailed') reqUrl.delete(params.requestId);
  });

  win.loadURL(CHATGPT_URL);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
