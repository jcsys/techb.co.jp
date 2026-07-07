# Description

ユーザの入力に応じて、ポータルサイトを生成する。

# Introduction

```
├─ .github/
│  ├─ agents/                   
│  │  └─ xxx.agent.md
│  ├─ instructions/               特定ファイルに対して処理するAI設定
│  │  └─ xxx.instructions.md
│  ├─ prompts/                    手動で動くAI設定,コマンドと相当
│  │  └─ xxx.prompt.md
│  ├─ skills/                     スキール
│  │  └─ xxx/
│  │     └─ SKILL.md		
│  └─ copilot-instructions.md     グローバルAI設定
├─ .vscode/                       vscodeの設定ファイル（git管理する）
│  └─ settings.json
├─ scripts/                       AIが呼び出すためのスクリプト
│  └─ Initialize-TemplateSite.ps1 テンプレートの獲得
├─ sites/                         生成したサイトの格納場所、このフォルダはGit管理しない
│  ├─ user1/                      ユーザ１の生成結果
│  └─ user2/                      ユーザ２の生成結果
├─ users/                         ユーザ入力情報
│  ├─ user1/                      ユーザ１
│  │  ├─ assets                   ユーザ１の画像など
│  │  └─ info.md                  ユーザ１の情報
│  ├─ user2/                      ユーザ２
│  │  ├─ assets                   ユーザ２の画像など
│  │  └─ info.md                  ユーザ２の情報
│  └─ info.template.md            ユーザ情報入力のテンプレート
├─ .gitignore
└─ README.md                      本ファイル
```

# Usage

## 開発時

### ツール
- vscode
- github copilot extension

### 使い方
- VS Codeにて .github\prompts\generate-single-user-site.prompt.md　を開き
- エディタ右上の▶アイコンで`Run prompt in New Chat`を実行
- Chatの提示に応じってユーザを指定してサイトを生成する

## 製品時

### ツール
- github copilot-cli

### 使い方
```shell
copilot -p "$(cat .github/prompts/generate-single-user-site.prompt.md)"
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
