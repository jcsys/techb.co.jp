# テンプレート取得方針

`design.template` の値から配布元を判断する。

## HTML5 UP

- 指定例: `html5up.net/editorial`、`html5up/editorial`
- ダウンロード: `https://html5up.net/editorial/download`
- 展開後は `index.html`、`assets/`、`images/` の構成を確認する。

## Start Bootstrap

- 指定例: `startbootstrap.com/agency`、`startbootstrap/agency`
- ダウンロード: `https://github.com/startbootstrap/startbootstrap-agency/archive/gh-pages.zip`
- 展開後は `dist/` またはルートの HTML、CSS、JS を確認する。

## ThemeWagon

- 指定例: `themewagon.com/sarab`、`themewagon/sarab`
- 参照元: `https://themewagon.github.io/sarab/`
- 配布 zip が特定できない場合は、公開ページの HTML と参照アセットを取得可能な範囲で取り込む。

## 注意

- 取得に失敗した場合でも、入力情報からテンプレートなしの静的サイトを生成できるようにする。
- ライセンス表記やクレジットを削除しない。
- `.cache/templates/` は作業用であり、最終成果物は `sites/<user-id>/` に置く。