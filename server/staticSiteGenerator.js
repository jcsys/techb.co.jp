const fs = require('node:fs');
const path = require('node:path');
const { validateUserId, resolveInside } = require('./pathUtils');

function text(value) {
  return value === undefined || value === null ? '' : String(value);
}

function escapeHtml(value) {
  return text(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeAssetPath(src) {
  const value = text(src).trim();
  if (!value) return '';
  if (/^(https?:)?\/\//.test(value) || value.startsWith('data:')) return value;
  if (value.startsWith('assets/img/')) return value;
  if (value.startsWith('assets/')) return value.replace(/^assets\//, 'assets/img/');
  return value;
}

function img(src, alt, className = '') {
  const normalized = normalizeAssetPath(src);
  if (!normalized) return '';
  return `<img ${className ? `class="${className}" ` : ''}src="${escapeHtml(normalized)}" alt="${escapeHtml(alt)}" loading="lazy">`;
}

function pageShell(data, current, title, body) {
  const defines = data.defines || {};
  const design = data.design || {};
  const companyName = defines.companyName || defines.siteName || 'Corporate Site';
  const logo = defines.siteLogo
    ? img(defines.siteLogo, `${companyName} logo`, 'brand__logo')
    : `<span class="brand__text">${escapeHtml(companyName)}</span>`;
  const pages = [
    ['index.html', 'トップ'],
    ['company.html', '会社案内'],
    ['services.html', 'サービス'],
    ['products.html', '製品情報'],
    ['careers.html', '採用情報'],
    ['contact.html', 'お問い合わせ']
  ];
  const nav = pages.map(([href, label]) => {
    const active = href === current ? ' aria-current="page"' : '';
    return `<a href="${href}"${active}>${label}</a>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(companyName)}の企業サイト">
  <title>${escapeHtml(title)} | ${escapeHtml(companyName)}</title>
  <link rel="stylesheet" href="assets/css/style.css">
  <script src="assets/js/main.js" defer></script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html">${logo}</a>
    <button class="nav-toggle" type="button" aria-label="ナビゲーションを開閉" aria-expanded="false">メニュー</button>
    <nav class="site-nav" aria-label="メインナビゲーション">${nav}</nav>
  </header>
  <main>${body}</main>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <strong>${escapeHtml(companyName)}</strong>
        <p>${escapeHtml(defines.address || '')}</p>
      </div>
      <div>
        <p>TEL: ${escapeHtml(defines.tel || '')}</p>
        <p>MAIL: ${escapeHtml(defines.email || '')}</p>
      </div>
    </div>
    <p class="copyright">${escapeHtml(defines.copyright || `Copyright © ${new Date().getFullYear()} ${companyName}`)}</p>
  </footer>
  <style>:root{--color-primary:${escapeHtml(design.primaryColor || '#27779f')};--color-accent:${escapeHtml(design.accentColor || '#4fa7d6')};--font-main:${escapeHtml(design.font || 'Noto Sans JP')}, system-ui, sans-serif;}</style>
</body>
</html>`;
}

function renderIndex(data) {
  const top = data.top || {};
  const defines = data.defines || {};
  const services = data.services || [];
  const products = data.products || [];
  const heroStyle = top.mainImage ? ` style="background-image:linear-gradient(90deg, rgba(0,0,0,.62), rgba(0,0,0,.24)), url('${escapeHtml(normalizeAssetPath(top.mainImage))}')"` : '';
  const aboutItems = (top.aboutItems || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return pageShell(data, 'index.html', 'トップ', `
    <section class="hero"${heroStyle}>
      <div class="container hero__inner">
        <p class="eyebrow">${escapeHtml(defines.companyName || '')}</p>
        <h1>${escapeHtml(top.catchcopy || defines.siteName || defines.companyName || '')}</h1>
        <p>${escapeHtml(top.lead || '')}</p>
        <a class="button" href="contact.html">お問い合わせ</a>
      </div>
    </section>
    <section class="section container">
      <p class="eyebrow">About</p>
      <h2>${escapeHtml(top.aboutTitle || '会社について')}</h2>
      <ul class="check-list">${aboutItems}</ul>
      <a class="text-link" href="company.html">会社案内を見る</a>
    </section>
    <section class="section section--soft">
      <div class="container card-grid">
        <article class="feature-card"><p class="eyebrow">Service</p><h2>事業紹介</h2><p>${escapeHtml(top.serviceSummary || '')}</p><a href="services.html">詳しく見る</a></article>
        <article class="feature-card"><p class="eyebrow">Products</p><h2>製品情報</h2><p>${escapeHtml(top.productsSummary || '')}</p><a href="products.html">詳しく見る</a></article>
        <article class="feature-card"><p class="eyebrow">Recruit</p><h2>採用情報</h2><p>${escapeHtml(top.recruitSummary || '')}</p><a href="careers.html">詳しく見る</a></article>
      </div>
    </section>
    <section class="section container">
      <p class="eyebrow">Pickup</p>
      <h2>主なサービス</h2>
      <div class="card-grid">${services.slice(0, 3).map((service) => `<article class="content-card">${img(service.image, service.title)}<h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.description)}</p></article>`).join('')}</div>
    </section>
    <section class="section section--soft">
      <div class="container">
        <p class="eyebrow">Products</p>
        <h2>製品・サービス</h2>
        <div class="card-grid">${products.slice(0, 3).map((product) => `<article class="content-card">${img(product.image, product.title)}<h3>${escapeHtml(product.title)}</h3><p>${escapeHtml(product.description)}</p></article>`).join('')}</div>
      </div>
    </section>
  `);
}

function renderCompany(data) {
  const company = data.company || {};
  const profileRows = (company.profile || []).map((item) => `<tr><th>${escapeHtml(item.label)}</th><td>${escapeHtml(item.value)}</td></tr>`).join('');
  const history = (company.history || []).map((item) => `<li><strong>${escapeHtml(item.year)}</strong><span>${escapeHtml(item.text)}</span></li>`).join('');
  return pageShell(data, 'company.html', '会社案内', `
    ${pageHero('会社案内', 'Company')}
    <section class="section container two-column">
      <div>${img(company.greetingImage, company.greetingTitle || 'ご挨拶')}</div>
      <div><p class="eyebrow">Message</p><h2>${escapeHtml(company.greetingTitle || 'ご挨拶')}</h2><p>${escapeHtml(company.greetingText || '')}</p><p class="signature">${escapeHtml(company.representative || '')}</p></div>
    </section>
    <section class="section section--soft"><div class="container"><p class="eyebrow">Profile</p><h2>会社概要</h2><table class="info-table">${profileRows}</table></div></section>
    <section class="section container"><p class="eyebrow">History</p><h2>沿革</h2><ul class="timeline">${history}</ul></section>
    <section class="section section--soft"><div class="container"><p class="eyebrow">Access</p><h2>アクセス</h2><p>${escapeHtml(company.access || '')}</p></div></section>
  `);
}

function renderListPage(data, current, title, eyebrow, items) {
  return pageShell(data, current, title, `
    ${pageHero(title, eyebrow)}
    <section class="section container">
      <div class="stack-list">
        ${(items || []).map((item, index) => `
          <article class="stack-item">
            <div>${img(item.image, item.title)}</div>
            <div><p class="eyebrow">${String(index + 1).padStart(2, '0')}</p><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description)}</p></div>
          </article>
        `).join('')}
      </div>
    </section>
  `);
}

function renderCareers(data) {
  const careers = data.careers || {};
  const jobs = (careers.jobs || []).map((job) => `
    <article class="job-card">
      <h2>${escapeHtml(job.title)}</h2>
      <table class="info-table">
        <tr><th>勤務地</th><td>${escapeHtml(job.location)}</td></tr>
        <tr><th>給与</th><td>${escapeHtml(job.salary)}</td></tr>
        <tr><th>仕事内容</th><td>${escapeHtml(job.description)}</td></tr>
        <tr><th>応募条件</th><td>${escapeHtml(job.requirements)}</td></tr>
        <tr><th>福利厚生</th><td>${escapeHtml(job.benefits)}</td></tr>
      </table>
    </article>
  `).join('');
  return pageShell(data, 'careers.html', '採用情報', `
    ${pageHero('採用情報', 'Recruit')}
    <section class="section container"><p>${escapeHtml(careers.message || '')}</p><div class="jobs">${jobs}</div></section>
    <section class="section section--soft"><div class="container"><h2>プライバシーポリシー</h2><p>${escapeHtml(careers.privacyPolicy || '')}</p></div></section>
  `);
}

function renderContact(data) {
  const defines = data.defines || {};
  const contact = data.contact || {};
  return pageShell(data, 'contact.html', 'お問い合わせ', `
    ${pageHero('お問い合わせ', 'Contact')}
    <section class="section container two-column">
      <div>
        <p>${escapeHtml(contact.description || '')}</p>
        <ul class="contact-list">
          <li><strong>電話</strong><span>${escapeHtml(contact.phone || defines.tel || '')}</span></li>
          <li><strong>メール</strong><span>${escapeHtml(contact.email || defines.email || '')}</span></li>
          <li><strong>住所</strong><span>${escapeHtml(contact.address || defines.address || '')}</span></li>
        </ul>
        ${contact.mapUrl ? `<a class="button" href="${escapeHtml(contact.mapUrl)}" target="_blank" rel="noopener noreferrer">Google Mapを見る</a>` : ''}
      </div>
      <form class="contact-form">
        <label>お名前<input type="text" name="name"></label>
        <label>メール<input type="email" name="email"></label>
        <label>お問い合わせ内容<textarea name="message"></textarea></label>
        <button class="button" type="submit">送信する</button>
      </form>
    </section>
  `);
}

function pageHero(title, eyebrow) {
  return `<section class="page-hero"><div class="container"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1></div></section>`;
}

function renderCss() {
  return `*{box-sizing:border-box}body{margin:0;color:#283241;font-family:var(--font-main);line-height:1.75;background:#fff}a{color:inherit}img{max-width:100%;display:block;border-radius:8px}.container{width:min(1120px,calc(100% - 40px));margin:0 auto}.site-header{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px max(20px,calc((100vw - 1120px)/2));background:rgba(255,255,255,.94);border-bottom:1px solid #e4e8ee;backdrop-filter:blur(12px)}.brand{display:flex;align-items:center;text-decoration:none;font-weight:800;color:var(--color-primary)}.brand__logo{max-height:48px;border-radius:0}.site-nav{display:flex;gap:20px;font-size:14px;font-weight:700}.site-nav a{text-decoration:none}.site-nav a[aria-current=page]{color:var(--color-primary)}.nav-toggle{display:none;border:0;border-radius:999px;background:var(--color-primary);color:#fff;padding:10px 14px;font-weight:700}.hero{min-height:560px;display:grid;align-items:center;background:linear-gradient(135deg,#123550,var(--color-primary));background-size:cover;background-position:center;color:#fff}.hero__inner{padding:90px 0}.eyebrow{margin:0 0 10px;color:var(--color-primary);font-size:13px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}.hero .eyebrow{color:#fff;opacity:.82}h1,h2,h3,p{overflow-wrap:anywhere}h1{margin:0;font-size:clamp(36px,6vw,68px);line-height:1.18}h2{margin:0 0 16px;font-size:clamp(26px,4vw,42px);line-height:1.25;color:#172033}h3{margin:16px 0 8px;color:#172033}.hero p{max-width:720px;font-size:19px}.button{display:inline-flex;align-items:center;justify-content:center;margin-top:22px;padding:12px 22px;border:0;border-radius:4px;background:var(--color-primary);color:#fff;text-decoration:none;font-weight:800;cursor:pointer}.section{padding:68px 0}.section--soft{background:#f5f8fa}.check-list{display:grid;gap:10px;padding-left:22px}.card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.feature-card,.content-card,.job-card{padding:24px;border:1px solid #e4e8ee;border-radius:8px;background:#fff;box-shadow:0 8px 24px rgba(17,24,39,.06)}.feature-card a,.text-link{font-weight:800;color:var(--color-primary)}.two-column{display:grid;grid-template-columns:1fr 1.2fr;gap:42px;align-items:start}.signature{text-align:right;font-weight:800}.page-hero{padding:54px 0;background:var(--color-primary);color:#fff}.page-hero .eyebrow,.page-hero h1{color:#fff}.info-table{width:100%;border-collapse:collapse;background:#fff}.info-table th,.info-table td{padding:14px 16px;border-bottom:1px solid #e4e8ee;text-align:left;vertical-align:top}.info-table th{width:180px;color:var(--color-primary);background:#f8fafc}.timeline{display:grid;gap:14px;padding:0;list-style:none}.timeline li{display:grid;grid-template-columns:140px 1fr;gap:18px;padding-bottom:14px;border-bottom:1px solid #e4e8ee}.stack-list{display:grid;gap:34px}.stack-item{display:grid;grid-template-columns:360px 1fr;gap:34px;align-items:center;padding-bottom:34px;border-bottom:1px solid #e4e8ee}.jobs{display:grid;gap:24px;margin-top:24px}.contact-list{display:grid;gap:10px;padding:0;list-style:none}.contact-list li{display:grid;grid-template-columns:90px 1fr;gap:12px}.contact-form{display:grid;gap:14px;padding:24px;border:1px solid #e4e8ee;border-radius:8px;background:#f8fafc}.contact-form label{display:grid;gap:6px;font-weight:800}.contact-form input,.contact-form textarea{width:100%;padding:11px;border:1px solid #cbd5e1;border-radius:4px;font:inherit}.contact-form textarea{min-height:130px}.site-footer{padding:38px 0 20px;background:#15384f;color:#fff}.footer-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.copyright{text-align:center;font-size:13px;opacity:.75}@media(max-width:800px){.site-header{align-items:flex-start}.nav-toggle{display:inline-flex}.site-nav{display:none;position:absolute;top:68px;left:20px;right:20px;flex-direction:column;padding:18px;background:#fff;border-radius:8px;box-shadow:0 16px 40px rgba(0,0,0,.14)}.site-nav.is-open{display:flex}.card-grid,.two-column,.stack-item,.footer-grid{grid-template-columns:1fr}.timeline li{grid-template-columns:1fr}.hero{min-height:460px}.section{padding:48px 0}}`;
}

function renderJs() {
  return `document.addEventListener('DOMContentLoaded',()=>{const t=document.querySelector('.nav-toggle');const n=document.querySelector('.site-nav');if(t&&n){t.addEventListener('click',()=>{const o=n.classList.toggle('is-open');t.setAttribute('aria-expanded',String(o));});}document.querySelectorAll('.contact-form').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();alert('静的サイトのため、フォーム送信処理は未接続です。');}));});`;
}

function copyAssets(repositoryRoot, userId, siteDir) {
  const userAssetsDir = resolveInside(repositoryRoot, 'users', userId, 'assets');
  const targetDir = resolveInside(siteDir, 'assets', 'img');
  if (!fs.existsSync(userAssetsDir)) return [];
  fs.mkdirSync(targetDir, { recursive: true });
  const copied = [];
  for (const entry of fs.readdirSync(userAssetsDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const from = path.join(userAssetsDir, entry.name);
    const to = path.join(targetDir, entry.name);
    fs.copyFileSync(from, to);
    copied.push(`assets/img/${entry.name}`);
  }
  return copied;
}

function generateStaticSite(repositoryRoot, siteData) {
  const userId = validateUserId(siteData.userId);
  const siteDir = resolveInside(repositoryRoot, 'sites', userId);
  fs.rmSync(siteDir, { recursive: true, force: true });
  fs.mkdirSync(resolveInside(siteDir, 'assets', 'css'), { recursive: true });
  fs.mkdirSync(resolveInside(siteDir, 'assets', 'js'), { recursive: true });
  fs.mkdirSync(resolveInside(siteDir, 'assets', 'img'), { recursive: true });

  const copiedAssets = copyAssets(repositoryRoot, userId, siteDir);
  const files = {
    'index.html': renderIndex(siteData),
    'company.html': renderCompany(siteData),
    'services.html': renderListPage(siteData, 'services.html', 'サービス', 'Service', siteData.services),
    'products.html': renderListPage(siteData, 'products.html', '製品情報', 'Products', siteData.products),
    'careers.html': renderCareers(siteData),
    'contact.html': renderContact(siteData),
    'assets/css/style.css': renderCss(),
    'assets/js/main.js': renderJs(),
    'robots.txt': 'User-agent: *\nAllow: /\n'
  };

  for (const [relativePath, content] of Object.entries(files)) {
    const target = resolveInside(siteDir, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
  }

  const report = [
    `# Generation Report - ${userId}`,
    '',
    '## Generated Pages',
    ...Object.keys(files).map((file) => `- ${file}`),
    '',
    '## Copied Assets',
    ...(copiedAssets.length ? copiedAssets.map((file) => `- ${file}`) : ['- なし'])
  ].join('\n');
  fs.writeFileSync(resolveInside(siteDir, 'generation-report.md'), report, 'utf8');

  return {
    success: true,
    userId,
    siteDirectory: siteDir,
    previewUrl: `/sites/${userId}/index.html`,
    files: Object.keys(files).concat(['generation-report.md'])
  };
}

module.exports = { generateStaticSite, renderCss, renderJs };
