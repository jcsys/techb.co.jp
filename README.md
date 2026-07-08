# Description

ユーザーの入力情報に応じて、AI が静的ポータルサイトを生成する工程である。

# Introduction

```
├─ .github/
│  ├─ agents/                     役割別のAIエージェント
│  │  └─ xxx.agent.md
│  ├─ instructions/               特定ファイルに対して適用するAI指示
│  │  └─ xxx.instructions.md
│  ├─ prompts/                    手動で実行するAIプロンプト,コマンドと相当
│  │  └─ xxx.prompt.md
│  ├─ skills/                     反復利用する生成技能
│  │  └─ xxx/
│  │     └─ SKILL.md		
│  ├─ superpowers/                上位判断のための補助知識
│  │  └─ xxx.md
│  └─ copilot-instructions.md     プロジェクト共通AI指示
├─ .vscode/                       vscodeの設定ファイル（git管理する）
│  └─ settings.json
├─ scripts/                       AIが呼び出すための補助スクリプト
│  └─ Initialize-TemplateSite.ps1 テンプレートの獲得
├─ sites/                         生成したサイトの格納場所、このフォルダはGit管理しない
│  ├─ user-1/                     ユーザー1の生成サイト
│  └─ user-2/                     ユーザー2の生成サイト
├─ users/                         ユーザー入力情報
│  ├─ user-1/                     ユーザー1
│  │  ├─ assets/                  ユーザー1の画像など
│  │  └─ info.md                  ユーザー1の情報
│  ├─ user-2/                     ユーザー2
│  │  ├─ assets/                  ユーザー2の画像など
│  │  └─ info.md                  ユーザー2の情報
│  └─ info.template.md            ユーザー情報入力のテンプレート
├─ .gitignore
└─ README.md                      本ファイル
```

# Usage

## 開発時

### ツール
- VS Code
- GitHub Copilot 拡張機能

### 使い方
- VS Code にて `.github\prompts\generate-user-site.prompt.md` を開く。
- エディタ右上の▶アイコンで `Run prompt in New Chat` を実行する。
- Chat の提示に従い、対象ユーザー名を指定してサイトを生成する。

## 製品時

### ツール
- GitHub Copilot CLI

### 使い方
```shell
copilot -p "$(cat .github/prompts/generate-user-site.prompt.md)"
```

# テンプレートの獲得

- [HTML5 UP](https://html5up.net)
  preview: `https://html5up.net/{xxx}`
  download format: `https://html5up.net/{xxx}/download`
- [BootstrapMade](https://bootstrapmade.com)
- [Start Bootstrap](https://startbootstrap.com)
- [ThemeWagon](https://themewagon.com)
- [Colorlib](https://colorlib.com/wp/templates)
- [Free CSS](https://www.free-css.com)
- [Templatemo](https://templatemo.com)
- [Cruip](https://cruip.com/free-templates)
- [Flowbite Templates](https://flowbite.com/templates)
- [Creative Tim](https://www.creative-tim.com)
