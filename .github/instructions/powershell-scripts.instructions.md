---
description: "scripts/*.ps1を作成・修正するときの規約。テンプレート取得、ユーザー検証、生成サイト検証の補助スクリプトを扱う。"
applyTo: "scripts/**/*.ps1"
---

# PowerShell スクリプト作成指示

- PowerShell 5.1 で動作する構文を優先する。
- `Set-StrictMode -Version Latest` と `$ErrorActionPreference = 'Stop'` を使う。
- 入力パラメーターは `param(...)` で明示する。
- エラー文、ヘルプ文、実行ログは日本語で出力する。
- リポジトリルートは `$PSScriptRoot` から相対的に解決する。
- `users/` の原本を変更する処理は、明示的な新規作成コマンドを除いて行わない。
- 失敗時は非ゼロ終了コードにし、CI や VS Code タスクから検出できるようにする。