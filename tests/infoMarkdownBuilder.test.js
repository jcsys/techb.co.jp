const test = require('node:test');
const assert = require('node:assert/strict');
const { createDefaultSiteData } = require('../server/siteDataDefaults');
const { buildInfoMarkdown } = require('../server/infoMarkdownBuilder');
const { buildAiGenerationPrompt } = require('../server/aiPromptBuilder');

test('buildInfoMarkdown renders corporate website sections', () => {
  const siteData = createDefaultSiteData();
  siteData.defines.companyName = 'Tech Bridge株式会社';
  siteData.services[0].title = 'Webサイト制作';

  const markdown = buildInfoMarkdown(siteData);

  assert.match(markdown, /# design/);
  assert.match(markdown, /# defines/);
  assert.match(markdown, /## index\(トップ\)/);
  assert.match(markdown, /## company\(会社案内\)/);
  assert.match(markdown, /## services\(サービス\/事業内容\)/);
  assert.match(markdown, /Tech Bridge株式会社/);
  assert.match(markdown, /Webサイト制作/);
});

test('buildAiGenerationPrompt wraps info markdown for AI generation', () => {
  const siteData = createDefaultSiteData();
  const prompt = buildAiGenerationPrompt(siteData);

  assert.match(prompt, /静的企業サイト生成依頼/);
  assert.match(prompt, /J\.C\.System/);
  assert.match(prompt, /```markdown/);
  assert.match(prompt, /Tech Bridge株式会社/);
});
