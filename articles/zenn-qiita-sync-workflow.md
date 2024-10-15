---
title: "Zenn vs Qiita論争に終止符を打てたらいいな..."
emoji: "🤖"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["zenn", "qiita", "github", "githubactions"]
published: true
---
## はじめに
自分自身のアウトプットの場の代表格として、Zenn・Qiitaが挙げられます。せっかく、記事を執筆したのに１つのプラットフォームでしか記事が共有されないのは、少しばかりもったいないですよね。巷では、どちらかのプラットフォームに記事を移す、であったり、どちらのプラットフォームの方が優れているのか？なんていう記事が投稿されていたりします。それなら一層のこと、どちらにも投稿すれば全て解決するのでは？なんて思ったのがこのツールの開発のきっかけでした。この記事では、ZennをGitHubで管理する要領で、Qiitaにも記事を投稿可能にするためのWorkflowについて説明します。GitHub Actionsで自動化できるようになっているので、一度実装さえしてしまえば、作業量を増やすことなく２種類のプラットフォームに記事を投稿可能です。また、GitHub Actionsに関する知識がほとんどなくても、実装できるように工夫をしていますので、ぜひお試しください。

また、今回公開しているWorkflowのソースコードはGitHubにて公開しております。詳細につきまして、ご興味のある方は以下のリンクからご覧ください。

https://github.com/C-Naoki/zenn-qiita-sync

## 事前準備
初めに、このツールの使用方法について説明いたします。実際に使用している例として、このツールを使用して記事を管理している私のリポジトリをご覧いただけると、よりイメージしやすいと思います。

https://github.com/C-Naoki/zenn-archive

### 1. GitHubリポジトリを作成する
このツールでは、執筆した記事をGitHubにて管理いたします。GitHubに新たなリポジトリを作成して、以下のようなディレクトリ構造を作成してください。

```
.
├── .github
│   └── workflows
│       └── publish.yml
├── articles
│   └── <Zenn形式の記事>
├── books
│   └── <Zenn形式の本 (任意)>
├── images
│   └── <記事で使用する画像ファイル>
└── qiita
    └── public
        └── <Qiita形式の記事>
```

ポイントとしては、`articles/` の中に執筆した記事を格納すると、`publish.yml`によって、自動的にQiita形式の記事が生成され、`qiita/public/`に格納されます。また、`books/`に保存されている本については、Qiitaへの同期は行われないことに注意してください。

### 2. Qiitaのアクセストークンを取得する
Qiita-CLIを使用するために、Qiitaのアクセストークンを取得する必要があります。https://qiita.com/settings/tokens/new からアクセストークンを取得してください。取得の流れの詳細については、以下をご確認ください。

https://github.com/increments/qiita-cli/tree/main#qiita-のトークンを発行する

### 3. QiitaアクセストークンをGitHubリポジトリにシークレット変数として登録する
`https://github.com/<USERNAME>/<REPO>/settings/secrets/actions/new` にアクセスして登録を行なってください（ただし、`<USERNAME>, <REPO>`については、作成したリポジトリの情報に置き換えてください）。ここで、`Name`に`QIITA_TOKEN`を、`Secret`に取得したトークンを入力し、`Add Secret`ボタンをクリックしてください。

以下のようになれば、登録完了です。

![](/images/zenn-qiita-sync-workflow/secrets.png)

### 4. GitHub ActionsのWorkflowを設定する
最後に、自動化の部分を担う`publish.yml`を設定します。特にこだわりがなければ、以下のコードをご使用ください。

```yaml
name: Publish articles

on:
  push:
  branches:
    - main
    - master
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false

jobs:
  publish_articles:
  runs-on: ubuntu-latest
  timeout-minutes: 5
  steps:
    - name: Checkout
      uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Run
      uses: C-Naoki/zenn-qiita-sync@main
      with:
        qiita-token: ${{ secrets.QIITA_TOKEN }}
```

他の設定として、`convert-commit-message`, `qiitacli-commit-message`なども使用することが可能です。今後のアップデートで、より柔軟な機能を追加する予定です。

## 使い方
使い方の基本としては、Zenn CLIと同様です。ここでは最低限の使い方を説明いたします。Zenn CLIの詳細については、以下の公式ドキュメントをご確認ください。

https://zenn.dev/zenn/articles/zenn-cli-guide

### 1. Zenn CLIをインストールする
以下の記事で説明されている手順に従って、Zenn CLIをインストールしてください。但し、Node.jsを使用することが前提となります。Node.jsのインストールについては、どのようなものでも良いですが、個人的にはvoltaをお勧めします。

https://zenn.dev/zenn/articles/install-zenn-cli

### 2. 記事を作成する
以下のコマンドを実行することで、記事のテンプレートを作成することができます。

```bash
npx zenn new:article --slug 記事のスラッグ --title タイトル
```

執筆後には、GitHubリポジトリにプッシュすることで、記事の投稿が完了します。

## コードの詳細
最後に、私が実装したコードの詳細について部分的に説明いたします。ここから先の情報は、ツールを使用する上で必須ではありませんが、興味がある方はご参照ください。

```yml
inputs:
  root:
    required: false
    default: "./qiita"
    description: "Root directory path"
  qiita-token:
    required: true
    description: 'Qiita API token'
  convert-commit-message:
    required: false
    default: "Convert Zenn articles to Qiita format"
    description: "Commit message for converting Zenn articles to Qiita format"
  qiitacli-commit-message:
    required: false
    default: "Updated by qiita-cli"
    description: "Qiita commit message"
```

この部分では、Workflowの入力値の設定を行なっています。基本的には、`qiita-token`だけ指定していただければ使用できる形式にしています。お好みに合わせて値を設定してください。

- `root`には、Qiita形式の記事を格納するディレクトリを指定します。
- `qiita-token`には、Qiitaのアクセストークンを指定します。
- `convert-commit-message`には、Zenn形式の記事から生成されたQiita形式の記事をプッシュする際のコミットメッセージを指定します。
- `qiitacli-commit-message`には、Qiita CLIを使用してQiitaに記事を投稿する際の変更点をプッシュする際のコミットメッセージを指定します。

```yml
runs:
  using: "composite"
  steps:
    ...
    - name: Get changed markdown files
      id: files
      run: |
        git diff --name-only ${{ github.event.before }} ${{ github.sha }} | grep "^articles/.*\.md$" > $GITHUB_WORKSPACE/changed_files.txt
        echo "📋 Changed markdown files:"
        cat $GITHUB_WORKSPACE/changed_files.txt
      continue-on-error: true
      shell: bash
```

ここで、前回のコミットにおいて、Zennの記事に修正が加わっているかどうかを判定します。そして、その変更されたファイルの名前を`changed_files.txt`を保存しています。また、GitHub Actionsのログから、どのファイルが変更されたか一目で理解できるように、絵文字付きで`changed_files.txt`の中身を表示しています。

```yml
runs:
  using: "composite"
  steps:
    ...
    - name: Convert Zenn articles to Qiita format
      run: |
        for file in $(cat $GITHUB_WORKSPACE/changed_files.txt); do
          filename=$(basename "$file" .md)
          echo "🚀 Convert $file to Qiita format"
          if [[ "$file" != articles/* ]]; then
            echo "⚠️ invalid file path: $file"
            if [[ -f "qiita/public/$filename.md" ]]; then
              echo "delete qiita/public/$filename.md cuz it's not included in articles/"
              rm "qiita/public/$filename.md"
            fi
            continue
          fi
          if grep -q "published: true" "$file"; then
            if [[ ! -f "qiita/public/$filename.md" ]]; then
              echo "🌱 Create new Qiita article"
              cd ./qiita
              npx qiita new "$filename"
              cd ../
            fi
            echo "🚚 Convert $file to qiita/public/$filename.md"
            node ${{ github.action_path }}/dist/index.js "$file" "./qiita/public/$filename.md"
          fi
        done
      shell: bash
      if: steps.files.outcome == 'success'
```

この部分にて、変更が加わったZenn形式の記事をQiita形式の記事に変換します。前半部分では、`articles/`に存在しないが、`qiita/public`には存在するファイルを削除しています。すなわち、Zenn形式の記事を削除した場合に、Qiita形式の記事も削除されるようにしています。また、後半部分では、`published: true`が指定されている、すなわち、記事を公開する設定がされているファイルについて、Qiitaの記事が存在しない場合はQiita形式の記事用のテンプレートを生成するようにし、その後、Zenn形式の記事をQiita形式の記事に変換しています。

変換のためのコードについては、`scripts/`ディレクトリに格納しているtypescriptのコードを、`@vercel/ncc`にてコンパイルした`dist/index.js`を使用しています。詳細については、以下の記事にて紹介されていたコードをベースに一部改良を加えたものを使用しています。

https://zenn.dev/ot07/articles/zenn-qiita-article-centralized

## まとめ
この記事では、ZennとQiitaの記事を同時に管理するためのWorkflowについて説明いたしました。GitHub Actionsを使用することで、自動化も実現しています。また、GitHub Actionsに関する知識がほとんどなくても、実装できるようにテンプレートも用意しているので、ぜひお試しください。また、使用にあたって疑問点や改善点等あれば、[issue](https://github.com/C-Naoki/zenn-qiita-sync/issues)を立てていただけると幸いです。

## 参考文献
有益な情報や価値あるコードを提供してくださった以下の記事及びOSSに感謝申し上げます。

https://github.com/zenn-dev/zenn-editor/tree/canary/packages/zenn-cli

https://github.com/increments/qiita-cli/

https://zenn.dev/ot07/articles/zenn-qiita-article-centralized

https://qiita.com/shunk_jr/items/7d1029cae8f83ee8fd84
