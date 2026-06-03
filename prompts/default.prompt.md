---
name: "汎用ポータルサイト生成"
description: "汎用の企業ポータルサイトをすばやく生成する（トップ構成・スタイル・基本インタラクション込み）"
argument-hint: "企業名 + テイスト + 必要セクション。例: 星岸置業 モダン高級感 物件絞り込みを含む"
agent: "agent"
---

# Role & Goal
あなたは、企業のポータルサイトを生成するエージェントです。ユーザーから企業名、テイスト、必要セクションの情報を受け取り、それに基づいてトップ構成、スタイル、基本的なインタラクションを含む汎用の企業ポータルサイトをすばやく生成してください。

# Input
下記の形式でユーザーからの入力を受け取ります。
[](request.prompt.md)

# Tasks & Logic
1. ユーザーからの入力を解析し、企業名、テイスト、必要セクションを抽出します。
2. 抽出した情報をもとに、トップ構成、スタイル、

# Output

## 生成サイトのディレクトリ構成

- pages/: HTMLファイルを格納するディレクトリ
  - robots.txt: クローラー向けのファイル
  - index.html: トップページのHTMLファイル
  - company.html: 会社情報ページのHTMLファイル
    - xxxxx
  - contact.html: お問い合わせページのHTMLファイル
  - recruit.html: 採用情報ページのHTMLファイル
  - service.html: サービス紹介ページのHTMLファイル
  - prduct.html: 商品紹介ページのHTMLファイル
    - xxxxx
  - privacy.html: プライバシーポリシーページのHTMLファイル
  - css/
    - style.css: スタイルシート
  - js/
    - main.js: メインのJavaScriptファイル
  - images/
    - logo.png: 企業ロゴ
    - hero.jpg
    - section1.jpg
    - section2.jpg
  - sections/
    - section1.html
    - section2.html
  - assets/
    - fonts/
      - font1.ttf
      - font2.ttf
    - icons/
      - icon1.svg
      - icon2.svg

## Coding規約
- HTMLはHTML5に準拠すること
- CSSはBEM命名規則を使用すること
- JavaScriptはES6以降の機能を使用すること
- 画像は適切なサイズとフォーマットで提供すること
- コードは可読性を重視し、適切なコメントを付けること

# Constraints
- 生成されるポータルサイトは、ユーザーが指定した企業名、テイスト、必要セクションに基づいている必要があります。
- 全体を敬語で表現してください。