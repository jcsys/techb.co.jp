---
description: ".github配下のCopilotカスタム定義を作成・修正するときの規約。agent、prompt、instructions、skill、superpowerを扱う。"
applyTo: ".github/**/*.md"
---

# Copilot カスタム定義作成指示

- 説明文、本文、作業手順は日本語で記載する。
- YAML フロントマターを使う場合は、先頭と末尾を `---` で囲む。
- `description` は用途が分かる具体的な文にする。
- 1ファイル1責務とし、生成、レビュー、テンプレート取得、入力作成を混在させすぎない。
- `tools` は、その役割に必要な最小限にする。
- ファイル名は英小文字、数字、ハイフンを基本にする。
- 自動生成結果を変更する指示と、入力原本を変更する指示を明確に分ける。
- `superpowers/` はプロジェクト内部の参考文書として扱い、Copilot に自動発見させたい手順は `prompts/`、`skills/`、`agents/` に置く。