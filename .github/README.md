# Webgen Copilot 設定

このディレクトリは「ユーザーデータに基づいてポータルサイトを一括生成する Copilot プロジェクト」を定義します。

## ディレクトリの役割

- `copilot-introduction.md`: 全体戦略、規約、品質ゲート
- `instructions/`: 強制ルール（解析・生成）
- `skills/`: 再利用可能な機能定義
- `agents/`: オーケストレーション役割定義
- `prompts/`: 手動実行用エントリ
- `superpowers/`: 高頻度ワークフロー

## 推奨利用手順

1. 単一ユーザー生成: `prompts/generate-single-user-site.prompt.md` を使用
2. 全ユーザー一括生成: `prompts/generate-all-users-sites.prompt.md` を使用
3. 出力先: `sites/<user-id>/` および `sites/generation-summary.md`

## データ契約

- 入力データ: `users/<user-id>/info.md`
- 入力アセット: `users/<user-id>/assets/`
- 生成結果: `sites/<user-id>/`

## テンプレート指定

- `info.md` に次のセクションを追加すると、指定テンプレートを先に取得してからサイト生成を行います。

```markdown
# design
## template
html5up.net/editorial
```

- `html5up.net/<name>` は `https://html5up.net/<name>/download` に解決します。
- 初期テンプレート展開スクリプト: `scripts/Initialize-TemplateSite.ps1`
