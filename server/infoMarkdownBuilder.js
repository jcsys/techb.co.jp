function value(value) {
  return value === undefined || value === null ? '' : String(value).trim();
}

function imageLine(src) {
  return value(src) ? `![](${value(src)})` : '';
}

function listLines(items) {
  return (items || [])
    .map((item) => value(item))
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join('\n');
}

function keyValueList(items) {
  return (items || [])
    .filter((item) => value(item.label) || value(item.value))
    .map((item) => `- ${value(item.label)}：${value(item.value)}`)
    .join('\n');
}

function buildInfoMarkdown(siteData) {
  const data = siteData || {};
  const design = data.design || {};
  const defines = data.defines || {};
  const top = data.top || {};
  const company = data.company || {};
  const careers = data.careers || {};
  const contact = data.contact || {};
  const services = data.services || [];
  const products = data.products || [];

  const defineLines = [
    `- site-logo:\n  ${imageLine(defines.siteLogo)}`,
    `- site-logo-sub:\n  ${imageLine(defines.siteLogoSub)}`,
    `- company-name:\n  ${value(defines.companyName)}`,
    `- site-name:\n  ${value(defines.siteName)}`,
    `- copyright:\n  ${value(defines.copyright)}`,
    `- address:\n  ${value(defines.address)}`,
    `- tel:\n  ${value(defines.tel)}`,
    `- fax:\n  ${value(defines.fax)}`,
    `- email:\n  ${value(defines.email)}`,
    `- official-url:\n  ${value(defines.officialUrl)}`
  ].join('\n');

  const serviceSections = services.map((service, index) => [
    `### item-${index + 1}: ${value(service.title) || `サービス${index + 1}`}`,
    '',
    value(service.description),
    '',
    imageLine(service.image)
  ].join('\n')).join('\n\n');

  const productSections = products.map((product, index) => [
    `### item-${index + 1}: ${value(product.title) || `製品${index + 1}`}`,
    '',
    value(product.description),
    '',
    imageLine(product.image)
  ].join('\n')).join('\n\n');

  const historyLines = (company.history || [])
    .filter((item) => value(item.year) || value(item.text))
    .map((item) => `- ${value(item.year)}\n  ${value(item.text)}`)
    .join('\n');

  const jobSections = (careers.jobs || []).map((job, index) => [
    `#### sub-item-${index + 1}: ${value(job.title) || `募集職種${index + 1}`}`,
    '',
    `| 項目 | 内容 |`,
    `| ---- | ---- |`,
    `| 勤務地 | ${value(job.location)} |`,
    `| 給与 | ${value(job.salary)} |`,
    `| 仕事内容 | ${value(job.description)} |`,
    `| 応募条件 | ${value(job.requirements)} |`,
    `| 福利厚生 | ${value(job.benefits)} |`
  ].join('\n')).join('\n\n');

  return `---
description: ${value(defines.companyName) || '会社'}の静的企業サイト入力情報
---

# design

## template

${value(design.template)}

## layout

${value(design.layout)}

## style

- primary-color: ${value(design.primaryColor)}
- accent-color: ${value(design.accentColor)}
- note: ${value(design.style)}

## font

- ${value(design.font)}

# defines

${defineLines}

# pages

## index(トップ)

${imageLine(top.mainImage)}

### item-1: ABOUT / ${value(top.aboutTitle) || '会社について'}

${listLines(top.aboutItems)}

[MORE](company.html)

### item-2: SERVICE / 事業紹介

${value(top.serviceSummary)}

[MORE](services.html)

### item-3: PRODUCTS / 製品紹介

${value(top.productsSummary)}

[MORE](products.html)

### item-4: RECRUIT / 採用情報

${value(top.recruitSummary)}

[MORE](careers.html)

## company(会社案内)

### item-1: ${value(company.greetingTitle) || 'ご挨拶'}

${imageLine(company.greetingImage)}

${value(company.greetingText)}

#### sub-item-1: 署名

${value(company.representative)}

### item-2: 会社概要

${keyValueList(company.profile)}

### item-3: 沿革

${historyLines}

### item-4: グループ会社

${listLines(company.groupCompanies)}

### item-5: 業務実績

${listLines(company.achievements)}

### item-6: アクセス

${value(company.access)}

## services(サービス/事業内容)

${serviceSections}

## products(製品情報)

${productSections}

## careers(採用情報)

### item-1: 募集要項

${value(careers.message)}

${jobSections}

### item-2: 応募フォーム

お問い合わせは下記のフォームから送信下さい。後日ご連絡いたします。

### item-3: プライバシーポリシー

${value(careers.privacyPolicy)}

## contact(お問い合わせ)

- 電話番号： ${value(contact.phone || defines.tel)}
- メールアドレス： ${value(contact.email || defines.email)}
- 住所： ${value(contact.address || defines.address)}
- 公式サイトURL： ${value(defines.officialUrl)}
- Google Map URL： ${value(contact.mapUrl)}

### item-1: 説明

${value(contact.description)}
`;
}

module.exports = { buildInfoMarkdown };
