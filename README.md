# Zenn & Qiita 記事管理リポジトリ

![](https://github.com/sorein-mio/zenn-archive/actions/workflows/publish.yml/badge.svg)

このリポジトリは[Zenn](https://zenn.dev/)と[Qiita](https://qiita.com/)の記事を管理・公開するために使用しています。主に、作成したコードを共有し、学んだことを記録するための場所です。他の人も参考にできる個人的なアーカイブとして機能しています。私の Zenn ページは[こちら](https://zenn.dev/sorein)、Qiita ページは[こちら](https://qiita.com/sorein)でそれぞれ確認できます。

## ディレクトリ構造

- `.github/workflows/`: GitHub Actions のワークフローファイルが含まれています。
- `articles/`: Zenn 記事（Markdown 形式）が含まれています。
- `public/`: Qiita 記事（Markdown 形式）が含まれています。
- `books/`: Zenn の本が含まれています。構造は Zenn の本のガイドラインに従っています。
- `images/`: 記事や本で使用される画像が含まれています。

## 使い方

### 開発サーバーの起動

Zenn 用のプレビューサーバーを起動するには：

```bash
npx zenn preview
```

- ブラウザで[http://localhost:8000](http://localhost:8000)を開くと結果が表示されます。

Qiita 用のプレビューサーバーを起動するには：

```bash
npx qiita preview
```

- ブラウザでプレビューが表示されます。

### 新しい記事の作成

#### Zenn 記事の作成

```bash
npx zenn new:article --slug 記事のスラッグ --title タイトル --type idea --emoji ✨
```

- 上記コマンドのオプションは以下の通りです：
  - `--slug`: 記事のスラッグ。12〜50 文字の`a-z0-9`、`ハイフン(-)`、`アンダースコア(_)`の組み合わせである必要があります。
  - `--title`: 記事のタイトル。
  - `--type`: 記事のタイプ。`tech`または`idea`から選択します。
  - `--emoji`: 記事の絵文字。

#### Qiita 記事の作成

```bash
npx qiita new 記事のファイル名
```

- 記事は`public/`ディレクトリに作成されます。

### 記事の公開

#### Zenn 記事の公開

articles/の記事ファイルで`published: true`に設定するか、`published_at`に日時を設定します。

#### Qiita 記事の公開

```bash
npx qiita publish 記事のファイルパス
```

- 例：`npx qiita publish public/my-article.md`

### 記事の取得・同期

Qiita から記事を取得するには：

```bash
npx qiita pull
```

## 注意点

- Qiita を使用するには、Qiita のアクセストークンでログインする必要があります：

```bash
npx qiita login
```

- Zenn の記事は GitHub リポジトリと連携することで自動的に公開されます。
- このリポジトリは Zenn と Qiita 両方の記事を管理するため、それぞれのプラットフォームのガイドラインに従ってください。
