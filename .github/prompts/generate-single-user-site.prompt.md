---
mode: ask
model: GPT-5.3-Codex
description: 指定ユーザー向けに完全なポータルサイトを生成する
---

単一ユーザー向けのポータルサイトを生成してください。

入力パラメータ:
- user_id: {{user_id}}
- style_hint: {{style_hint}}

実行要件:
1. `users/{{user_id}}/info.md` と `assets/` を読み込むこと。
2. `## template` があれば、その指定からテンプレートをダウンロードして `sites/{{user_id}}/` へ展開すること。
3. グローバル規約に従いテンプレート上へ内容を反映すること。
4. `index.html`, `company.html`, `services.html`, `contact.html` を生成すること。
5. 対応データがある場合は `products.html`, `careers.html`, `news.html` を追加生成すること。
6. `generation-report.md` を出力し、テンプレート情報、欠損項目、アセットコピー結果を記載すること。
