const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { createDefaultSiteData } = require('./siteDataDefaults');
const { buildInfoMarkdown } = require('./infoMarkdownBuilder');
const { buildAiGenerationPrompt } = require('./aiPromptBuilder');
const { generateStaticSite } = require('./staticSiteGenerator');
const { saveAsset } = require('./assetManager');
const { validateUserId, resolveInside } = require('./pathUtils');

const repositoryRoot = path.resolve(__dirname, '..');
const builderRoot = path.join(repositoryRoot, 'builder');
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload, null, 2));
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(message);
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 12 * 1024 * 1024) {
        reject(new Error('リクエスト本文が大きすぎます。'));
        request.destroy();
      }
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('JSON本文が不正です。'));
      }
    });
    request.on('error', reject);
  });
}

function listUsers() {
  const usersDir = resolveInside(repositoryRoot, 'users');
  if (!fs.existsSync(usersDir)) return [];
  return fs.readdirSync(usersDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function saveInfo(siteData) {
  const userId = validateUserId(siteData.userId);
  const userDir = resolveInside(repositoryRoot, 'users', userId);
  fs.mkdirSync(resolveInside(userDir, 'assets'), { recursive: true });
  const infoPath = resolveInside(userDir, 'info.md');
  fs.writeFileSync(infoPath, buildInfoMarkdown({ ...siteData, userId }), 'utf8');
  return { userId, infoPath };
}

function getSafeStaticFile(baseDir, urlPath, prefix = '') {
  const cleanPath = decodeURIComponent(urlPath.slice(prefix.length) || '/index.html');
  const relative = cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\/+/, '');
  return resolveInside(baseDir, relative);
}

function serveFile(response, baseDir, urlPath, prefix = '') {
  let filePath;
  try {
    filePath = getSafeStaticFile(baseDir, urlPath, prefix);
  } catch {
    sendText(response, 403, 'Forbidden');
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendText(response, 404, 'Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  response.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(response);
}

async function handleApi(request, response, pathname) {
  try {
    if (request.method === 'GET' && pathname === '/api/users') {
      sendJson(response, 200, { users: listUsers(), defaultSiteData: createDefaultSiteData() });
      return;
    }

    if (request.method !== 'POST') {
      sendJson(response, 405, { error: '許可されていないメソッドです。' });
      return;
    }

    const payload = await readJson(request);

    if (pathname === '/api/save-info') {
      const result = saveInfo(payload.siteData || payload);
      sendJson(response, 200, { success: true, ...result, infoMarkdown: buildInfoMarkdown(payload.siteData || payload) });
      return;
    }

    if (pathname === '/api/build-ai-prompt') {
      sendJson(response, 200, { prompt: buildAiGenerationPrompt(payload.siteData || payload) });
      return;
    }

    if (pathname === '/api/generate-site') {
      const siteData = payload.siteData || payload;
      saveInfo(siteData);
      const result = generateStaticSite(repositoryRoot, siteData);
      sendJson(response, 200, result);
      return;
    }

    if (pathname === '/api/upload-asset') {
      const result = saveAsset(repositoryRoot, payload.userId, payload.fileName, payload.dataUrl);
      sendJson(response, 200, { success: true, ...result });
      return;
    }

    sendJson(response, 404, { error: 'APIルートが見つかりません。' });
  } catch (error) {
    sendJson(response, 400, { error: error.message });
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (url.pathname.startsWith('/api/')) {
    handleApi(request, response, url.pathname);
    return;
  }

  if (url.pathname.startsWith('/sites/')) {
    serveFile(response, resolveInside(repositoryRoot, 'sites'), url.pathname, '/sites');
    return;
  }

  if (url.pathname.startsWith('/users/')) {
    serveFile(response, resolveInside(repositoryRoot, 'users'), url.pathname, '/users');
    return;
  }

  serveFile(response, builderRoot, url.pathname);
});

server.listen(port, () => {
  console.log(`webgen builder started: http://localhost:${port}`);
});
