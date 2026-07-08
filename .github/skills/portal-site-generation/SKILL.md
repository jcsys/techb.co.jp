---
name: portal-site-generation
description: "標準化データをもとに、完全なポータルサイトのページと静的リソース構成を生成します。"
argument-hint: "対象ユーザー名。例: user-1"
---

# スキル: ポータルサイト生成

## 目的

標準化データをもとに、完全なポータルサイトのページと静的リソース構成を生成します。

## 入力

- user-id
- 正規化済みユーザーデータオブジェクト
- assetsマニフェスト

## 出力

- 任意ページ及ぶサブページ, 例:
  - `sites/<user-id>/index.html`
  - `sites/<user-id>/company.html`
    - `sites/<user-id>/company/company1.html`
  - `sites/<user-id>/services.html`
  - `sites/<user-id>/products.html`
    - `sites/<user-id>/products/product1.html`
    - `sites/<user-id>/products/product2.html`
  - `sites/<user-id>/contact.html`
- `sites/<user-id>/assets/`
- `sites/<user-id>/generation-report.md`

## ルール

- `info.md` に `design.template` 定義がある場合、ページ生成前にそのテンプレートを取得して展開する。
  - テンプレート取得: [template-sources](./references/template-sources.md)
- ページ構造はセマンティック（header/main/nav/footer）にする。
- コンポーネント再利用を優先し、ページごとの重複実装を避ける。
- スタイル変数は `:root` に集約する。
- JS は必要最小限の操作（メニュー、アンカー、フォーム基本検証）に限定する。

## 検証チェックリスト

- ナビゲーションリンクがすべて到達可能である。
- 画像パスがすべて存在する。
- ページタイトルと主見出しが一致し、可読である。
- 欠損データにはプレースホルダを入れ、空白ページを作らない。
