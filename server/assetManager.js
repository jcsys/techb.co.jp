const fs = require('node:fs');
const path = require('node:path');
const { validateUserId, resolveInside } = require('./pathUtils');

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);

function sanitizeFileName(fileName) {
  const base = path.basename(String(fileName || '')).replace(/[^A-Za-z0-9._-]+/g, '-');
  if (!base) throw new Error('ファイル名が不正です。');
  const ext = path.extname(base).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    throw new Error('対応していない画像形式です。jpg, png, gif, webp, svg を使用してください。');
  }
  return base;
}

function saveAsset(repositoryRoot, userId, fileName, dataUrl) {
  const safeUserId = validateUserId(userId);
  const safeFileName = sanitizeFileName(fileName);
  const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('画像データが不正です。');
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 8 * 1024 * 1024) throw new Error('画像サイズは8MB以内にしてください。');
  const assetsDir = resolveInside(repositoryRoot, 'users', safeUserId, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });
  const target = resolveInside(assetsDir, safeFileName);
  fs.writeFileSync(target, buffer);
  return {
    fileName: safeFileName,
    path: `assets/${safeFileName}`
  };
}

module.exports = { saveAsset };
