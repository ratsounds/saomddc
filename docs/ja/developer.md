---
layout: page
title: Developer
permalink: /ja/developer/
lang: ja
order: 50
index: true
---
## SAO:MD:DCを自前のサーバで動かす
SAO:MD:DCはプレーンなHTMLとjavascriptのみで動作し、データベースなどのバックエンドを必要としません。適当にHTTPサーバ立ててDocument Rootのどっかに放り込めばOK。

## データの編集
SAO:MD:DCのコアは[data.json](https://github.com/ratsounds/saomddc/blob/master/data/data.json)に含まれるキャラクター等のデータで、新しいキャラが追加された場合は追加の作業が必要になる。data.jsonは現在[Google Spreadsheet](https://www.google.com/intl/ja_jp/sheets/about/)を利用して管理されており、[saomddb v080 github copy 20190324](https://drive.google.com/open?id=1pmj5XSX79-efDoJbQDoRHboWQ1Atf-HpQojua55aSMA)(※2019/03/24時点のコピーで閲覧のみ可能。Json出力用のWebAPIは閉じてある。)のようなスプレッドシートで編集を行う。このスプレッドシートは各種データの記録・パラメータの推定を行うツールや、data.jsonへの変換スクリプト等も含む。現状いくつかの運用ルールを守らないとデータが破壊されるので、共同編集は限定的にしている。

## ドキュメントの編集とコミット
SAO:MD:DCのドキュメント群は[Github Page](https://pages.github.com/)の機能を利用して表示する為、[Jekyll](https://jekyllrb.com/)のビルドが可能なテスト環境を構築するのが望ましい。

### ビルド環境の構築
Ruby 2.1.0以上とbundlerが必要なので、[Setting up your GitHub Pages site locally with Jekyll](https://help.github.com/en/articles/setting-up-your-github-pages-site-locally-with-jekyll#requirements)を参考にして環境を構築する。ビルドに必要な設定ファイル等はSAO:MD:DCのソースコードに含まれているので[#requirements](https://help.github.com/en/articles/setting-up-your-github-pages-site-locally-with-jekyll#requirements)の部分のみでよい。当然のことながら、実際にGithub経由で共同編集をする場合Gitの環境やGithubのアカウントも必要になるので用意する。(※現在このリポジトリでの共同編集の進め方は検討中で、まだ共同編集者の募集は行っていません。)

以下の説明ではソースコード置き場をsrcとする。SAO:MD:DCのリポジトリをクローン。

```console
cd src
git clone git@github.com:ratsounds/saomddc.git
```

クローンしたソースコードのディレクトリへ移動。

```console 
cd saomddc
```

bundlerで必要なファイル群をインストール。

```console 
bundle install
```

完了したらローカルホストでテスト用サーバを起動するとhttp://localhost:4000 でアクセス出来るはず。

```console 
bundle exec jekyll serve
```

テスト用サーバをローカルネットワークに公開する場合は↓。

```console 
bundle exec jekyll serve --host 0.0.0.0
```
テスト用サーバが起動中はファイルの編集を検知してリビルドがかかるはず。

### 編集
ドキュメントはMarkdown形式なので好きなエディタで編集する。
Markdown形式はわりと方言が多いのでエディタのプレビューだけでなく、最終的にちゃんとJekyllのテストサーバでビルドして閲覧可能かチェックする。なおGithub Pageでは[GitHub Flavored Markdown(GFM)](https://help.github.com/en/categories/writing-on-github)と呼ばれる拡張形式。

SAO:MD:DCではドキュメントはdocsディレクトリ配下に言語にわけて配置する。

```console
.
├── docs
│   ├── en
│   │   ├── developer.md
│   │   ├── index.md
│   │   ├── knowledge.md
│   │   ├── tips.md
│   │   └── usage.md
│   ├── enq0319.md
│   ├── images
│   │   ├── (省略)
│   │   └── setting_time.jpg
│   └── ja
│       ├── developer.md
│       ├── index.md
│       ├── knowledge.md
│       ├── tips.md
│       └── usage.md
├── (省略)
```

SAO:MD:DCのMarkdownファイルでは下記のようなFront-matterにいくつか独自の設定値を持つ。

#### 多言語対応とヘッダーメニューの自動生成

```yaml
title: Tips & Tricks #多言語化する場合はtitleを統一
permalink: /ja/tips/ #i18nの言語コードをディレクトリ階層にいれるのを推奨
lang: ja #i18nの言語コード
order: 20 #ヘッダーメニューのソートオーダー。orderが0以下だとヘッダーへ非表示。
```

挙動としてはFront-matterが書かれた.mdファイルがJekyllによって処理され、orderが０以上の.mdファイルが自動的にorderの順でヘッダーメニューへリストされる。

#### 目次の自動生成

```yaml
index: true
```
trueだと見出しの階層から自動的に見出しを作る。

#### 目次の自動生成

```yaml
search: true
```

trueだと検索UIが右上に追加される。
検索を有効にするには、SAO:MD:DC用語集形式でMarkdownフィアルを書く必要がある。具体的には下記のように用語の名前を第三見出し、続けてblockquoteで説明を記載する。

```markdown
### 用語
> 説明
> hogehoge
```


### 編集結果のコミット
編集が終わったら変更を追加。
```console 
git add 編集したファイルのパス
```
もしくは編集したもの全てを追加。
```console 
git add .
```
変更を追加したらコミットして変更を共有。
```console 
git commit -m "comment"
```