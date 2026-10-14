# HP作成ソリューション 引き継ぎ資料

更新日: 2026-10-14  
対象リポジトリ: `https://github.com/jcsys/techb.co.jp`  
本番ブランチ: `main`  
引き継ぎ時点のコミット: `5525428`

## 1. 本資料の目的

本資料は、HP作成ソリューションの保守担当者が、以下の作業を単独で実施できるようにするための引き継ぎ資料です。

1. ローカル環境でVisual Builderを起動する
2. 会社情報、サービス、画像などを入力する
3. `info.md`、AI向けPrompt、静的サイトを生成する
4. 生成結果を確認し、本番公開用ファイルへ反映する
5. GitHubへPushし、Cloudflare Pagesで公開する
6. 障害発生時に原因を確認し、必要に応じて以前の版へ戻す

## 2. ソリューション概要

本プロジェクトは、会社情報をブラウザ上のフォームへ入力し、企業ホームページを静的HTMLとして生成するMVPです。

```text
会社情報・画像
    ↓
Visual Builder
    ├─ users/<user-id>/info.md
    ├─ AI生成用Prompt
    └─ sites/<user-id>/ 静的サイト
              ↓ 内容確認後に本番用へ反映
        public-site/
              ↓ Git Push
        GitHub mainブランチ
              ↓ 自動デプロイ
        Cloudflare Pages
              ↓
        https://techb.co.jp
```

第一版では、入力された事実情報を確実に反映するため、固定ルールによる静的サイト生成を採用しています。AI向けPromptは生成できますが、OpenAI等の外部AI APIはまだ接続していません。

## 3. システムと管理範囲

| システム | 役割 | 注意事項 |
|---|---|---|
| GitHub `jcsys/techb.co.jp` | ソースコードと本番公開ファイルの管理 | 現在は完全なソースを格納 |
| Cloudflare Pages | `public-site/`の静的サイト公開 | Production branchは`main` |
| Cloudflare DNS | Web、メール等のDNS管理 | Nameserver切替後のDNS管理先 |
| Cloudflare Workers | 問い合わせフォーム/API用 | 現時点では未実装 |
| お名前.com | `techb.co.jp`の登録・更新 | DNSをCloudflareへ委任する場合も契約は継続 |
| メールサービス | `info@techb.co.jp`等の送受信 | サービス選定とDNS設定は別途必要 |

アカウントのID・パスワードは共有せず、GitHub CollaboratorおよびCloudflare Member機能で必要な権限を付与してください。

## 4. 現在の実装状況

### 完了済み

- ブラウザ上の会社情報入力フォーム
- ライブプレビュー
- 複数のサービス、製品、採用情報の入力
- Logo、背景画像、各コンテンツ画像のパス指定
- 画像ファイルのローカル保存
- `users/<user-id>/info.md`生成
- AI向けPrompt生成
- 複数ページの静的サイト生成
- Tech Bridge用サンプルデータと画像
- 本番公開用`public-site/`
- GitHubへの完全なソース移行

### 未完了・今後の対応

- 実AI Providerとの接続
- 問い合わせフォームのCloudflare Worker接続
- 会社メールアドレスの正式決定
- MX、SPF、DKIM、DMARC設定
- 会社情報・文言・画像の最終承認
- PDFからの会社情報自動抽出
- 入力内容の自動保存、履歴管理
- `sites/tech-bridge/`から`public-site/`への自動同期

問い合わせページのフォームは表示されますが、現在の`script.js`では送信を停止し、未接続であることをAlert表示します。

## 5. 必要環境

- Windows 10またはWindows 11
- Node.js 18以上
- Git
- GitHubアカウント
- 推奨エディタ: Visual Studio Code

Node.jsとGitを確認します。

```powershell
node --version
git --version
```

本プロジェクトは外部npmパッケージを使用していないため、通常は`npm install`不要です。

## 6. 初回セットアップ

会社GitHubからCloneします。

```powershell
git clone https://github.com/jcsys/techb.co.jp.git
cd techb.co.jp
```

テストを実行します。

```powershell
npm.cmd test
```

Visual Builderを起動します。

```powershell
npm.cmd run dev
```

ブラウザで以下を開きます。

```text
http://localhost:3000
```

ポート3000が使用中の場合は、PowerShellで別ポートを指定できます。

```powershell
$env:PORT=3001
npm.cmd run dev
```

この場合は`http://localhost:3001`を開きます。

## 7. ディレクトリ構成

```text
webgen/
├─ builder/                  Visual Builderの画面
│  ├─ index.html
│  ├─ styles.css
│  └─ app.js
├─ server/                   ローカルサーバーと生成ロジック
│  ├─ server.js
│  ├─ siteDataDefaults.js
│  ├─ infoMarkdownBuilder.js
│  ├─ aiPromptBuilder.js
│  ├─ staticSiteGenerator.js
│  ├─ assetManager.js
│  └─ pathUtils.js
├─ users/                    入力データと元画像
│  ├─ info.template.md
│  └─ tech-bridge/
│     ├─ info.md
│     └─ assets/
├─ sites/                    ローカル生成結果（Git管理対象外）
├─ public-site/              Cloudflare本番公開対象
├─ tests/                    自動テスト
├─ scripts/                  補助PowerShellスクリプト
├─ package.json
├─ README.md
└─ HANDOVER.md
```

### 重要な3つのディレクトリ

| ディレクトリ | 内容 | Git管理 |
|---|---|---|
| `users/tech-bridge/` | Tech Bridgeの入力情報と元画像 | 対象 |
| `sites/tech-bridge/` | Visual Builderが生成した確認用サイト | 対象外 |
| `public-site/` | Cloudflareが公開する正式サイト | 対象 |

`静的サイト生成`を実行しても、`public-site/`は自動更新されません。生成後に内容を確認し、本番公開すると判断した場合のみ`public-site/`へ反映してください。

## 8. Visual Builder操作手順

### 8.1 基本情報を入力

- User ID
- 会社名
- サイト名
- 会社概要
- 対象ユーザー
- サイト目的
- 代表者
- 設立日
- 資本金
- 所在地
- 電話番号
- メールアドレス

User IDには英数字、ハイフン等の安全な値を使用します。Tech Bridgeでは`tech-bridge`を使用します。

### 8.2 デザイン情報を入力

- Template/Layout
- メインカラー
- ページ幅
- フォント
- 雰囲気
- Logoパス
- フッターLogoパス
- メイン画像パス

Tech Bridgeの主な画像パス例:

```text
assets/logo.svg
assets/logo_w.svg
assets/main-hero.png
assets/greeting.png
assets/service-system-app.png
assets/service-staffing.png
assets/service-consulting.png
assets/service-realestate-tourism.png
assets/product-it-solution.png
```

ユーザー入力では`assets/<file-name>`形式を使用します。生成されたサイトでは`assets/img/<file-name>`として参照されます。

### 8.3 画像を登録

1. User IDを入力する
2. `画像アップロード`で画像を選択する
3. `assetsへ保存`を押す
4. 表示された保存先を該当する画像入力欄へ貼り付ける

画像は`users/<user-id>/assets/`へ保存されます。ファイル名の重複に注意してください。

### 8.4 コンテンツを入力

- ご挨拶
- サービス
- 製品情報
- 採用情報
- お問い合わせ

サービス、製品、採用情報は複数追加できます。登記簿の事業目的をそのまま10個のサービスへ分割する必要はありません。会社HPでは関連事業を4～6分類程度へ整理し、詳細説明の中で登記目的を補足する方法を推奨します。

### 8.5 保存と生成

1. `info.md 保存`を押す
2. `users/<user-id>/info.md`が更新されたことを確認する
3. `AI Prompt 作成`でPrompt内容を確認する
4. `静的サイト生成`を押す
5. 結果欄のプレビューURLを開く

生成先:

```text
sites/<user-id>/
```

生成ページ:

```text
index.html
company.html
services.html
products.html
careers.html
contact.html
robots.txt
assets/css/style.css
assets/js/main.js
assets/img/*
```

## 9. ローカル確認項目

本番反映前に以下を確認します。

- 全ページが開く
- Header/FooterのLogoが表示される
- メイン画像と各サービス画像が表示される
- ナビゲーションリンクが正しい
- 会社名、住所、代表者等に誤りがない
- CTAリンクが正しい
- PCとスマートフォン幅でレイアウトが崩れない
- 外部リンクが新しいタブで開く
- 未確定の電話番号、メールアドレスが残っていない
- 問い合わせフォームが未接続であることを関係者が理解している

自動テストも実行します。

```powershell
npm.cmd test
```

## 10. 本番公開用ファイルへの反映

生成結果を確認し、承認された場合のみ`public-site/`へコピーします。

```powershell
Copy-Item -Path .\sites\tech-bridge\* -Destination .\public-site -Recurse -Force
```

コピー後、差分を必ず確認します。

```powershell
git status --short
git diff -- public-site users/tech-bridge
```

不要なファイルが`public-site/`に残る可能性があるため、ページ構成を変更した場合はファイル一覧も確認してください。

## 11. Git運用

### 11.1 通常の更新

```powershell
git switch main
git pull --ff-only origin main
git switch -c feature/update-tech-bridge-content
```

変更後:

```powershell
npm.cmd test
git status --short
git add users/tech-bridge public-site
git commit -m "Update Tech Bridge website content"
git push -u origin feature/update-tech-bridge-content
```

GitHubでPull Requestを作成し、確認後に`main`へMergeします。`main`への直接Pushは、緊急時を除いて避けてください。

### 11.2 引き継ぎ時点のブランチ

```text
main                    5525428 完全なソース
feature/webgen-ver0.1   5525428 開発時の分岐
backup/static-site-before-full-source-2026-10-14
                        690fb9f 完全ソース移行前の静的サイト
```

### 11.3 元開発PCのRemote構成

```text
origin  https://gitlab.com/jcs-webgen/webgen.git
github  https://github.com/pluto3z/webgen-tech-bridge-demo.git
techb   https://github.com/jcsys/techb.co.jp.git
```

新しく会社GitHubからCloneした環境では、通常`origin`が`https://github.com/jcsys/techb.co.jp.git`になります。

## 12. Cloudflare Pages設定

完全なソースをGitHubへ移行したため、Cloudflareはリポジトリ全体ではなく`public-site/`だけを公開するよう設定します。

```text
Git Repository: jcsys/techb.co.jp
Production branch: main
Framework preset: None
Root directory: 空欄
Build command: 空欄
Build output directory: public-site
```

GitHub連携が有効な場合、`main`更新後にCloudflare Pagesが自動デプロイします。

確認手順:

1. Cloudflare Dashboardを開く
2. `Workers & Pages`を開く
3. 対象Pagesプロジェクトを選択する
4. `Deployments`で最新コミットを確認する
5. Preview URLで表示を確認する
6. Custom Domainで`techb.co.jp`の状態を確認する

GitHubリポジトリがPrivateの場合でも、Cloudflare GitHub Appへ対象リポジトリの参照権限を付与すればデプロイ可能です。

## 13. ドメインとDNS

正式ドメインは`techb.co.jp`です。過去資料にある`tech-bridge.co.jp`とは異なるため、設定時に間違えないでください。

推奨構成:

```text
techb.co.jp       本番サイト
www.techb.co.jp   techb.co.jpへRedirect
api.techb.co.jp   将来の問い合わせWorker/API
```

お名前.comはドメイン登録・更新を担当し、DNS解析をCloudflareへ委任します。

Nameserver変更の概要:

1. Cloudflareへ`techb.co.jp`を追加する
2. Cloudflareが指定する2つのNameserverを確認する
3. 現在のDNSレコードをCloudflareへ登録する
4. お名前.comでNameserverをCloudflare指定値へ変更する
5. CloudflareでZoneがActiveになるまで待つ
6. PagesへCustom Domainを追加する

Nameserver変更はメールへ影響する可能性があります。メール設定を確認せずに変更しないでください。

## 14. メール設定

`info@techb.co.jp`等を利用する場合は、Webサイトとは別にメールサービスが必要です。

候補例:

- お名前.comメールサーバー
- Microsoft 365 Business Basic

Cloudflare DNSへメールサービス指定の以下のレコードを登録します。

- MX
- SPF（TXT）
- DKIM（TXTまたはCNAME）
- DMARC（TXT）
- サービス確認用TXT/CNAME

値はメールサービス提供元の管理画面・公式資料から取得してください。推測で登録しないでください。

## 15. 問い合わせフォームの今後の構成

現時点ではフォーム送信処理は未接続です。将来は以下の構成を予定しています。

```text
contact.html
    ↓ HTTPS POST
Cloudflare Worker
    ├─ 入力チェック
    ├─ Spam対策
    ├─ Rate Limit
    └─ メール送信サービス
            ↓
      info@techb.co.jp
```

実装時には、送信先メールアドレスやAPI KeyをHTMLまたはGitHubへ直接記載せず、Cloudflare Secretsを使用してください。

## 16. トラブルシューティング

### 16.1 `npm run dev`が起動しない

- Node.js 18以上か確認する
- ポート3000が使用中でないか確認する
- 別ポートを指定して起動する

```powershell
$env:PORT=3001
npm.cmd run dev
```

### 16.2 画像が表示されない

確認項目:

- 元画像が`users/<user-id>/assets/`に存在する
- 入力パスが`assets/<file-name>`になっている
- 生成先に`assets/img/<file-name>`が存在する
- 大文字・小文字、拡張子が一致している
- `public-site/assets/img/`にもコピーされている

### 16.3 GitHub Pushで403になる

エラー例:

```text
Permission to jcsys/techb.co.jp.git denied
```

確認事項:

- GitHub Collaborator招待を承認済みか
- Pushしているアカウントが許可されたアカウントか
- Windows Git Credential Managerに別アカウントが残っていないか

アカウント一覧:

```powershell
git credential-manager github list
```

このリポジトリで使用するユーザーを指定:

```powershell
git config --local credential.https://github.com.username <GitHubユーザー名>
git credential-manager github login --username <GitHubユーザー名> --browser --force
```

### 16.4 Cloudflareで404またはトップページが表示されない

- Production branchが`main`か確認する
- Build output directoryが`public-site`か確認する
- `public-site/index.html`がGitHubに存在するか確認する
- 最新Deploymentのログを確認する

### 16.5 GitHubを更新してもサイトが変わらない

- 変更が`users/`だけでなく`public-site/`にも反映されているか
- `main`へMerge済みか
- Cloudflareの自動デプロイが有効か
- ブラウザCacheを除外して再確認する

### 16.6 問い合わせフォームから送信できない

現時点の仕様です。Cloudflare Workerが未実装のため、フォーム表示のみとなっています。

## 17. ロールバック

### 17.1 通常のコード変更を戻す

共有ブランチでは履歴を書き換えず、`git revert`を使用します。

```powershell
git log --oneline
git revert <取り消すコミットID>
git push origin main
```

### 17.2 完全ソース移行前の静的サイトへ戻す

以下のGitHubブランチに移行前の静的サイトが保存されています。

```text
backup/static-site-before-full-source-2026-10-14
```

コミット:

```text
690fb9f Add Tech Bridge corporate website
```

緊急時でも、確認なしに`main`へForce Pushしないでください。復旧方法は担当者間で確認してから実行します。

### 17.3 Cloudflareの以前のDeploymentへ戻す

Cloudflare Pagesの`Deployments`から正常だった以前のDeploymentを確認し、Rollbackまたは再デプロイを実行します。GitHub側の原因コミットも`git revert`して、次回デプロイで再発しないようにします。

## 18. セキュリティ上の注意

- パスワード、API Key、TokenをGitへCommitしない
- `.env`をGit管理しない
- Cloudflare Workerの機密値はSecretsへ保存する
- お名前.comの主アカウントを共有しない
- GitHubとCloudflareは個人アカウントをMemberとして追加する
- Nameserver、MX、SPF、DKIM変更前に設定値を記録する
- `main`へ反映する前にPull Requestで差分を確認する

現在の`jcsys/techb.co.jp`がPublicの場合、Cloudflareが`public-site/`だけを公開していても、GitHub上では生成器の完全なソースを閲覧できます。内部実装を非公開にする場合は、リポジトリをPrivateへ変更してください。

## 19. 推奨する日常運用

```text
1. Issueまたは作業依頼を確認
2. mainを最新化
3. featureブランチを作成
4. Visual Builderで情報更新
5. 静的サイト生成
6. ローカル確認
7. public-siteへ反映
8. npm test
9. Commit / Push
10. Pull Requestレビュー
11. mainへMerge
12. Cloudflare Deployment確認
13. 正式URLで最終確認
```

公開後は最低限、トップページ、各下層ページ、画像、モバイル表示、問い合わせ導線を確認してください。

## 20. 引き継ぎ完了チェックリスト

### 環境・権限

- [ ] GitHubリポジトリをCloneできる
- [ ] Branch作成とPushができる
- [ ] Cloudflare対象プロジェクトを閲覧できる
- [ ] Deploymentログを確認できる
- [ ] ドメイン管理担当者を把握している
- [ ] メールサービス管理担当者を把握している

### 開発・生成

- [ ] `npm.cmd run dev`で起動できる
- [ ] `http://localhost:3000`を開ける
- [ ] Tech Bridgeの情報を変更できる
- [ ] 画像を登録し、正しいパスを入力できる
- [ ] `info.md`を保存できる
- [ ] AI向けPromptを生成できる
- [ ] 静的サイトを生成できる
- [ ] `sites/`と`public-site/`の違いを説明できる

### 公開・保守

- [ ] `public-site/`の差分を確認できる
- [ ] Pull Requestを作成できる
- [ ] Cloudflareの本番Deploymentを確認できる
- [ ] 以前のコミットへ戻す方法を理解している
- [ ] 問い合わせフォームが未接続であることを理解している
- [ ] DNSとメールレコードを不用意に変更しないことを理解している

すべて確認できた時点で、通常のサイト更新作業を引き継ぎ先担当者が単独で実施できる状態とします。
