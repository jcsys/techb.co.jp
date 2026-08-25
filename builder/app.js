const form = document.querySelector('#builder-form');
const servicesList = document.querySelector('#services-list');
const productsList = document.querySelector('#products-list');
const jobsList = document.querySelector('#jobs-list');
const statusBox = document.querySelector('#status');
const infoOutput = document.querySelector('#info-output');
const promptOutput = document.querySelector('#prompt-output');
const livePreview = document.querySelector('#live-preview');
const resultPanel = document.querySelector('#result-panel');

const initialServices = [
  {
    title: 'Webサイト制作',
    description: '企業サイト、LP、採用サイトなど、目的に合わせた静的Webサイトを制作します。',
    image: ''
  },
  {
    title: 'システム開発',
    description: '業務効率化やサービス立ち上げに必要なWebシステムを設計・開発します。',
    image: ''
  }
];

const initialProducts = [
  {
    title: '導入事例・サービス紹介',
    description: 'お客様の課題解決につながるサービスや事例を紹介します。',
    image: ''
  }
];

const initialJobs = [
  {
    title: 'Webエンジニア',
    location: '',
    salary: '',
    description: 'Webサイト制作、システム開発、運用改善などを担当します。',
    requirements: 'Web開発経験、コミュニケーション能力',
    benefits: ''
  }
];

function setStatus(message) {
  statusBox.textContent = message;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function getValue(name) {
  const field = form.elements[name];
  return field ? field.value.trim() : '';
}

function splitLines(value) {
  return String(value || '').split('\n').map((line) => line.trim()).filter(Boolean);
}

function parsePairs(value) {
  return splitLines(value).map((line) => {
    const index = line.indexOf(':') >= 0 ? line.indexOf(':') : line.indexOf('：');
    if (index < 0) return { label: line, value: '' };
    return {
      label: line.slice(0, index).trim(),
      value: line.slice(index + 1).trim()
    };
  });
}

function createRepeatCard(type, item = {}) {
  const card = document.createElement('div');
  card.className = 'repeat-card';

  if (type === 'job') {
    card.innerHTML = `
      <div class="repeat-card__head"><strong>募集職種</strong><button type="button" class="secondary remove-repeat">削除</button></div>
      <div class="grid">
        <label>職種<input data-field="title" value="${escapeHtml(item.title || '')}"></label>
        <label>勤務地<input data-field="location" value="${escapeHtml(item.location || '')}"></label>
        <label>給与<input data-field="salary" value="${escapeHtml(item.salary || '')}"></label>
        <label>福利厚生<input data-field="benefits" value="${escapeHtml(item.benefits || '')}"></label>
        <label class="wide">仕事内容<textarea data-field="description">${escapeHtml(item.description || '')}</textarea></label>
        <label class="wide">応募条件<textarea data-field="requirements">${escapeHtml(item.requirements || '')}</textarea></label>
      </div>
    `;
  } else {
    const label = type === 'service' ? 'サービス' : '製品';
    card.innerHTML = `
      <div class="repeat-card__head"><strong>${label}</strong><button type="button" class="secondary remove-repeat">削除</button></div>
      <div class="grid">
        <label>タイトル<input data-field="title" value="${escapeHtml(item.title || '')}"></label>
        <label>画像パス<input data-field="image" value="${escapeHtml(item.image || '')}" placeholder="assets/example.jpg"></label>
        <label class="wide">説明<textarea data-field="description">${escapeHtml(item.description || '')}</textarea></label>
      </div>
    `;
  }

  card.querySelector('.remove-repeat').addEventListener('click', () => {
    card.remove();
    updateOutputs();
  });
  card.addEventListener('input', updateOutputs);
  return card;
}

function collectRepeat(container) {
  return [...container.querySelectorAll('.repeat-card')].map((card) => {
    const item = {};
    card.querySelectorAll('[data-field]').forEach((field) => {
      item[field.dataset.field] = field.value.trim();
    });
    return item;
  });
}

function collectSiteData() {
  return {
    userId: getValue('userId'),
    design: {
      template: getValue('design.template'),
      layout: getValue('design.layout'),
      primaryColor: getValue('design.primaryColor'),
      accentColor: getValue('design.accentColor'),
      font: getValue('design.font'),
      style: getValue('design.style')
    },
    defines: {
      siteLogo: getValue('defines.siteLogo'),
      siteLogoSub: getValue('defines.siteLogoSub'),
      companyName: getValue('defines.companyName'),
      siteName: getValue('defines.siteName'),
      copyright: getValue('defines.copyright'),
      address: getValue('defines.address'),
      tel: getValue('defines.tel'),
      fax: getValue('defines.fax'),
      email: getValue('defines.email'),
      officialUrl: getValue('defines.officialUrl')
    },
    top: {
      mainImage: getValue('top.mainImage'),
      catchcopy: getValue('top.catchcopy'),
      lead: getValue('top.lead'),
      aboutTitle: getValue('top.aboutTitle'),
      aboutItems: splitLines(getValue('top.aboutItems')),
      serviceSummary: getValue('top.serviceSummary'),
      productsSummary: getValue('top.productsSummary'),
      recruitSummary: getValue('top.recruitSummary')
    },
    company: {
      greetingImage: getValue('company.greetingImage'),
      greetingTitle: getValue('company.greetingTitle'),
      greetingText: getValue('company.greetingText'),
      representative: getValue('company.representative'),
      profile: parsePairs(getValue('company.profile')),
      history: parsePairs(getValue('company.history')).map((item) => ({ year: item.label, text: item.value })),
      groupCompanies: splitLines(getValue('company.groupCompanies')),
      achievements: splitLines(getValue('company.achievements')),
      access: getValue('company.access')
    },
    services: collectRepeat(servicesList),
    products: collectRepeat(productsList),
    careers: {
      message: getValue('careers.message'),
      jobs: collectRepeat(jobsList),
      privacyPolicy: getValue('careers.privacyPolicy')
    },
    contact: {
      phone: getValue('contact.phone'),
      email: getValue('contact.email'),
      address: getValue('contact.address'),
      mapUrl: getValue('contact.mapUrl'),
      description: getValue('contact.description')
    }
  };
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'リクエストに失敗しました。');
  return data;
}

function renderPreview(data) {
  const services = data.services.slice(0, 3).map((item) => `<div class="preview-card"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.description)}</span></div>`).join('');
  const products = data.products.slice(0, 2).map((item) => `<div class="preview-card"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.description)}</span></div>`).join('');
  livePreview.innerHTML = `
    <div class="preview-nav"><span>トップ</span><span>会社案内</span><span>サービス</span><span>製品情報</span><span>採用情報</span></div>
    <div class="preview-hero" style="background:linear-gradient(135deg,#15384f,${escapeHtml(data.design.primaryColor || '#27779f')})">
      <p>${escapeHtml(data.defines.companyName)}</p>
      <h3>${escapeHtml(data.top.catchcopy)}</h3>
      <p>${escapeHtml(data.top.lead)}</p>
    </div>
    <div class="preview-section">
      <h4>ABOUT</h4>
      <p>${escapeHtml(data.top.aboutTitle)}</p>
      <ul>${data.top.aboutItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>
    <div class="preview-section">
      <h4>SERVICE</h4>
      <div class="preview-grid">${services}</div>
    </div>
    <div class="preview-section">
      <h4>PRODUCTS</h4>
      <div class="preview-grid">${products}</div>
    </div>
    <div class="preview-section">
      <h4>CONTACT</h4>
      <p>${escapeHtml(data.contact.phone || data.defines.tel)} / ${escapeHtml(data.contact.email || data.defines.email)}</p>
    </div>
  `;
}

function localInfoMarkdown(data) {
  const profile = data.company.profile.map((item) => `- ${item.label}：${item.value}`).join('\n');
  return [
    `# ${data.defines.companyName || '会社'} 入力プレビュー`,
    '',
    '## 保存後は users/{user-id}/info.md に正式なMarkdownが生成されます。',
    '',
    `- user-id: ${data.userId}`,
    `- company-name: ${data.defines.companyName}`,
    `- official-url: ${data.defines.officialUrl}`,
    '',
    '## 会社概要',
    profile,
    '',
    '## サービス',
    ...data.services.map((item) => `- ${item.title}: ${item.description}`),
    '',
    '## 製品情報',
    ...data.products.map((item) => `- ${item.title}: ${item.description}`)
  ].join('\n');
}

function updateOutputs() {
  const data = collectSiteData();
  renderPreview(data);
  infoOutput.textContent = localInfoMarkdown(data);
}

async function saveInfo() {
  const siteData = collectSiteData();
  setStatus('info.md を保存しています...');
  const result = await postJson('/api/save-info', { siteData });
  infoOutput.textContent = result.infoMarkdown;
  setStatus(`保存しました: ${result.infoPath}`);
}

async function buildAiPrompt() {
  const siteData = collectSiteData();
  setStatus('AI Prompt を作成しています...');
  const result = await postJson('/api/build-ai-prompt', { siteData });
  promptOutput.textContent = result.prompt;
  setStatus('AI Prompt を作成しました。');
}

async function generateSite() {
  const siteData = collectSiteData();
  setStatus('静的サイトを生成しています...');
  const result = await postJson('/api/generate-site', { siteData });
  resultPanel.classList.remove('hidden');
  resultPanel.innerHTML = `
    <h2>生成結果</h2>
    <p><strong>出力先:</strong> ${escapeHtml(result.siteDirectory)}</p>
    <p><strong>プレビュー:</strong> <a href="${escapeHtml(result.previewUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(result.previewUrl)}</a></p>
    <p><strong>ファイル:</strong></p>
    <ul>${result.files.map((file) => `<li>${escapeHtml(file)}</li>`).join('')}</ul>
  `;
  setStatus('静的サイトを生成しました。');
}

async function uploadAsset() {
  const fileInput = document.querySelector('#asset-upload');
  const file = fileInput.files[0];
  if (!file) {
    setStatus('アップロードする画像を選択してください。');
    return;
  }
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const userId = getValue('userId');
  setStatus('画像を保存しています...');
  const result = await postJson('/api/upload-asset', { userId, fileName: file.name, dataUrl });
  document.querySelector('#asset-result').textContent = `保存先: ${result.path}`;
  setStatus('画像を保存しました。パスを必要な入力欄へ貼り付けてください。');
}

document.querySelector('#add-service').addEventListener('click', () => {
  servicesList.appendChild(createRepeatCard('service'));
  updateOutputs();
});
document.querySelector('#add-product').addEventListener('click', () => {
  productsList.appendChild(createRepeatCard('product'));
  updateOutputs();
});
document.querySelector('#add-job').addEventListener('click', () => {
  jobsList.appendChild(createRepeatCard('job'));
  updateOutputs();
});
document.querySelector('#save-info').addEventListener('click', () => saveInfo().catch((error) => setStatus(error.message)));
document.querySelector('#build-ai-prompt').addEventListener('click', () => buildAiPrompt().catch((error) => setStatus(error.message)));
document.querySelector('#generate-site').addEventListener('click', () => generateSite().catch((error) => setStatus(error.message)));
document.querySelector('#upload-asset').addEventListener('click', () => uploadAsset().catch((error) => setStatus(error.message)));
form.addEventListener('input', updateOutputs);

initialServices.forEach((item) => servicesList.appendChild(createRepeatCard('service', item)));
initialProducts.forEach((item) => productsList.appendChild(createRepeatCard('product', item)));
initialJobs.forEach((item) => jobsList.appendChild(createRepeatCard('job', item)));
updateOutputs();
