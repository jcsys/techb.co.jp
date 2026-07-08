# Webgen Copilot 導入ガイド

このリポジトリでは、構造化された Markdown データをもとに、複数ユーザー向けのポータルサイトを生成する AI 主導ワークフローを定義します。

## 目的

- 安定した生成戦略とコーディング規約を統一する。
- ユーザーデータをフォルダ単位で分離管理する。
- 同一の生成パイプラインを各ユーザーに再利用する。
- レビューとデプロイが可能な再現性の高い成果物を出力する。

## 基本モデル

生成モデルは次の 3 層で構成します。

1. グローバルルール（ブランド非依存）:
   - サイト情報設計
   - デザイン・アクセシビリティ基準
   - コード品質制約
2. ユーザーデータ層:
   - `users/<user-id>/info.md`
   - `users/<user-id>/assets/*`
3. 生成成果物層:
   - `sites/<user-id>/...` に生成されたサイト

## 標準ディレクトリ契約

```
webgen/
  .github/
    agents/
    instructions/
    prompts/
    skills/
    superpowers/
    copilot-introduction.md
  users/
    user-1/
      assets/
      info.md
    user-2/
      assets/
      info.md
  sites/
    user-1/
    user-2/
```

## データマッピング規則

- `info.md` はコンテンツの単一情報源とする。
- `info.md` に `## template` セクションがある場合、その値を生成ベーステンプレートとして扱う。
- `template` が `html5up.net/<template-name>` 形式の場合、`https://html5up.net/<template-name>/download` をダウンロード URL として解決する。
- 項目が不足している場合、生成器は以下を実施する。
  - セクション構造を維持する。
  - プレースホルダ文言を挿入する。
  - 生成コメントに TODO を記録する。
- アセットは `users/<user-id>/assets/` から `sites/<user-id>/assets/` へコピーする。
- Markdown 画像の相対リンクはサイトで安全に参照できるパスへ変換する。

## サイト標準仕様

- 必須ページ:
  - `index.html`
  - `company.html`
  - `services.html`
  - `contact.html`
- データがある場合のみ生成する任意ページ:
  - `products.html`
  - `careers.html`
  - `news.html`
- 共通リソース:
  - `assets/css/style.css`
  - `assets/js/main.js`
  - `assets/img/*`

## 品質ゲート

各ユーザーサイトは次のチェックを通過すること。

1. 構造チェック:
   - 必須ページがすべて存在する。
   - ナビゲーションリンクが有効である。
2. コンテンツチェック:
   - `{{company_name}}` のような未解決プレースホルダが残っていない。
3. アクセシビリティチェック:
   - 画像に `alt` 属性がある。
   - 見出し階層が `h1` から開始される。
4. パフォーマンスチェック:
   - 必要な場合を除き、ヘッダ内で描画を阻害する JS を読み込まない。

## Copilot コンポーネント連携

- `instructions/`: 生成ルールと制約を定義する。
- `skills/`: データ解析、ページ構築、検証などの再利用スキルを定義する。
- `agents/`: スキル実行順を管理する編成役を定義する。
- `prompts/`: 手動実行の入口を定義する。
- `superpowers/`: 単体生成や一括生成など高頻度ワークフローを定義する。

## 推奨実行フロー

1. ユーザー ID を選択する。
2. `users/<user-id>/info.md` を解析する。
3. `## template` を解決し、必要に応じてテンプレートをダウンロードする。
4. `users/<user-id>/assets/` をインデックス化する。
5. テンプレート上でページ生成計画を作成する。
6. `sites/<user-id>/` にテンプレートを展開し、その上にサイト内容を生成する。
7. 品質ゲートを実行する。
8. 生成レポートを出力する。

## バージョン管理方針

- 生成サイトはレビュー可能な形でコミットする。
- 生成中に元データを変更しない。
- 実行ごとにレポートファイルを追加する。
  - 例: `sites/<user-id>/generation-report.md`
