const path = require('node:path');

function validateUserId(userId) {
  const value = String(userId || '').trim();
  if (!/^[A-Za-z0-9._-]+$/.test(value)) {
    throw new Error('user-id は英数字、ドット、アンダースコア、ハイフンのみ使用できます。');
  }
  return value;
}

function resolveInside(baseDir, ...segments) {
  const root = path.resolve(baseDir);
  const target = path.resolve(root, ...segments);
  if (target !== root && !target.startsWith(root + path.sep)) {
    throw new Error('許可されていないパスです。');
  }
  return target;
}

module.exports = { validateUserId, resolveInside };
