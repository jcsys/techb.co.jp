const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { createDefaultSiteData } = require('../server/siteDataDefaults');
const { generateStaticSite } = require('../server/staticSiteGenerator');

test('generateStaticSite writes multi-page static corporate site', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'webgen-site-'));
  const siteData = createDefaultSiteData();
  siteData.userId = 'tech-bridge';
  siteData.defines.companyName = 'Tech Bridge株式会社';
  siteData.defines.tel = '03-1234-5678';

  const result = generateStaticSite(root, siteData);

  assert.equal(result.success, true);
  assert.equal(result.userId, 'tech-bridge');
  assert.equal(result.previewUrl, '/sites/tech-bridge/index.html');

  for (const file of ['index.html', 'company.html', 'services.html', 'products.html', 'careers.html', 'contact.html']) {
    assert.equal(fs.existsSync(path.join(root, 'sites', 'tech-bridge', file)), true, `${file} should exist`);
  }

  const index = fs.readFileSync(path.join(root, 'sites', 'tech-bridge', 'index.html'), 'utf8');
  const contact = fs.readFileSync(path.join(root, 'sites', 'tech-bridge', 'contact.html'), 'utf8');

  assert.match(index, /Tech Bridge株式会社/);
  assert.match(index, /日本と世界をつなぐ/);
  assert.match(contact, /03-1234-5678/);
});
