const { buildInfoMarkdown } = require('./infoMarkdownBuilder');

function buildAiGenerationPrompt(siteData) {
  const infoMarkdown = buildInfoMarkdown(siteData);
  return [
    '# 静的企業サイト生成依頼',
    '',
    'あなたはプロのWebデザイナー兼フロントエンドエンジニアです。',
    '以下の入力情報をもとに、J.C.Systemのような信頼感のある企業サイト構成を参考にして、静的サイトを生成してください。',
    '',
    '## 必須要件',
    '',
    '- 出力は HTML / CSS / Vanilla JavaScript の静的ファイルにしてください。',
    '- 会社名、住所、電話番号、メール、サービス名、製品名などの事実情報は変更しないでください。',
    '- トップ、会社案内、サービス、製品情報、採用情報、お問い合わせのページを生成してください。',
    '- レスポンシブ対応にしてください。',
    '- 画像パスは入力情報の値を優先してください。',
    '- 生成物は `sites/<user-id>/` に配置できる構成にしてください。',
    '',
    '## 入力情報',
    '',
    '```markdown',
    infoMarkdown.trim(),
    '```'
  ].join('\n');
}

module.exports = { buildAiGenerationPrompt };
