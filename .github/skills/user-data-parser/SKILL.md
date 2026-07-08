---
name: user-data-parser
description: "users/<user-id>/info.mdを解析し、design、defines、pages、assets参照をページ生成向けの構造化データへ正規化するときに使用する。"
argument-hint: "対象ユーザー名。例: user-1"
---

# スキル: ユーザーデータ解析

## 目的

`users/<user-id>/info.md` をページ生成に利用可能な構造化データへ変換します。

## 解析方針


- 見出し構造[info-format](./references/info-format.md)を認識し、セクションマップを構築する。
- `- key: value` リストを認識する。
- 段落テキストと画像参照を認識する。
- 任意項目マーク（例: 「オプション」）を認識する。

## 正規化出力形

- `design`
  - `design.template`
  - `design.layout`
  - `design.style`
  - `design.font`
- `defines[]`
- `pages[]`
  - `page`
    - `page[]`
    - `item[]`
      - `subitem[]`
- `custom_sections[]`

## エラーハンドリング

- ファイル欠損時は最小構造を返し、エラー理由を明示する。
- 解析衝突時は元テキスト断片を `custom_sections` に保持する。
- 空項目は破棄せず明示的に保持する。
