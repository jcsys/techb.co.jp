---
description: "指定ユーザーのusers/<user-id>/info.mdからsites/<user-id>/へ静的ポータルサイトを生成する。"
agent: "Portal Site Generator"
argument-hint: "対象ユーザー名。例: user-1"
---

# ユーザーサイト生成
対象ユーザー名を確認し、未指定の場合はユーザーに質問してください。
対象ユーザー向けのポータルサイトを生成してください。

## 入力パラメータ:
- user-id: {{user-id}}
- style_hint: {{style_hint}}

## 実行要件:
- `users/{{user-id}}/info.md` と `users/{{user-id}}/assets/` を読み込むこと。
- `design.template` の指定があれば、その指定からテンプレートをダウンロードして `sites/{{user-id}}/` へ展開すること。
- グローバル規約に従いテンプレート上へ内容を反映すること。
- `sites/<user-id>/` に静的サイトを生成してください。
- `users/<user-id>/assets/` の素材を確認し、必要なデータを `sites/<user-id>/assets/` に取り込んでください。
- 対応データに応じって各ページを生成すること。
- `generation-report.md` を出力し、テンプレート情報、欠損項目、アセットコピー結果を記載すること。

## 完了条件
- `sites/<user-id>/index.html` が存在する。
- 入力情報の主要内容がサイトへ反映されている。
- 未置換の `{{...}}` が残っていない。
- ローカル画像とリンクが解決できる。
- 検証結果と残る手動確認項目を報告している。

