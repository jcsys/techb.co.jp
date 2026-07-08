---
description: "users/<user-id>/info.mdを作成・修正するときの入力規約。design、defines、pages、画像参照、テンプレート指定を扱う。"
applyTo: "users/**/info.md"
---

# ユーザー情報ファイル作成指示

- 本文は日本語で記載する。
- `# design`、`# defines`、`# pages` の3ブロックを維持する。
- `design.template` は、`html5up.net/<name>`、`startbootstrap.com/<name>`、`themewagon.com/<name>` の形式を優先する。
- `defines` にはサイト全体で再利用する値を置く。会社名、住所、電話番号、ロゴ、著作権表記はここへ集約する。
- `pages` は `page/item/sub-item` の階層で記載する。`page` は下層ページとして多段にしてよい。
- 画像は同じユーザー配下の `assets/` から相対パスで参照する。
- 生成時に本文化してほしくないメモは HTML コメントで書く。
- 入力ファイルには秘密情報、認証情報、未公開の個人情報を含めない。