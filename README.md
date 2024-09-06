# zenn-archive
This repository, "zenn-archive", is used to manage and publish articles on [Zenn](https://zenn.dev/) using [Zenn CLI](https://github.com/zenn-dev/zenn-editor) and GitHub. Primarily, it's a place to share code I've created and record what I've learned. This serves as a personal archive that others can also learn from. They are then synced with Zenn for publication. Click [here](https://zenn.dev/naoki0103) for details.

## Directory Structure

- `articles/`: The directory where new article markdown files are stored.
- `books/`: The directory for writing books. The structure should follow the Zenn book guidelines.

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
