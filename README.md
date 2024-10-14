# zenn-archive
![](https://github.com/C-Naoki/zenn-archive/actions/workflows/publish.yml/badge.svg)

This repository is used to manage and publish articles on [Zenn](https://zenn.dev/) and [Qiita](https://qiita.com/). Primarily, it's a place to share the code I've created and record what I've learned. This serves as a personal archive from which others can also learn. You can find my pages on Zenn [here](https://zenn.dev/naoki0103) and on Qiita [here](https://qiita.com/C-Naoki), respectively. In addition, I use this [zenn-qiita-sync](https://github.com/C-Naoki/zenn-qiita-sync) to synchronize Qiita articles with Zenn articles.

## Directory Structure

- `.github/workflows/`: It contains GitHub Actions workflows.
- `articles/`: It contains Zenn articles written in Markdown format.
- `books/`: It contains Zenn books. The structure should follow the Zenn book guidelines.
- `images/`: It contains images used in articles and books.
- `qiita/`: It contains Qiita articles, which are generated from Zenn articles by `ztoq.sh`.

## Getting Started
Run the development server:
```bash
npx zenn preview
```
- Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

When you want to write a new article:
```bash
npx zenn new:article --slug 記事のスラッグ --title タイトル --type idea --emoji ✨
```
- The above command's options are as follows:
    - `--slug`: The slug of the article. This needs to be a combination of `a-z0-9`, `hyphen (-)`, and `underscore (_)` with 12 to 50 characters.
    - `--title`: The title of the article.
    - `--type`: The type of the article. The options should be chosen from `tech`, `idea`.
    - `--emoji`: The emoji of the article.
