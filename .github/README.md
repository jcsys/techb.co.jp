# Copilot 設定

このディレクトリは「ユーザーデータに基づいてポータルサイトを一括生成する Copilot プロジェクト」を定義します。

## ディレクトリの役割

- `copilot-instructions.md`: 全体戦略、規約、品質ゲート
- `instructions/`: 強制ルール（解析・生成）
- `skills/`: 再利用可能な機能定義
- `agents/`: オーケストレーション役割定義
- `prompts/`: 手動実行用エントリ
- `superpowers/`: 高頻度ワークフローの参考文書（Copilot の標準自動発見対象外）

## 推奨利用手順

- 単一ユーザー生成: `prompts/generate-user-site.prompt.md` を使用
- 全ユーザー一括生成: `prompts/generate-all-users-sites.prompt.md` を使用

## データ契約

- 入力データ: `users/<user-id>/info.md`
- 入力アセット: `users/<user-id>/assets/`
- 生成結果: `sites/<user-id>/` および `sites/generation-summary.md`

