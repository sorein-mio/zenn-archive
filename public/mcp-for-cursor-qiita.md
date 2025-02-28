---
title: CursorのMCPサーバーがJSON対応したので使いそうな機能をまとめたリポジトリを作成してみた
tags:
  - Cursor
  - MCP
  - AI
  - 開発ツール
  - エディタ
private: false
updated_at: ""
id: null
organization_url_name: null
slide: false
ignorePublish: false
---

# Cursor の MCP サーバーが JSON 対応したので便利機能をまとめたリポジトリを作りました

## はじめに

こんにちは！最近、Cursor IDE が[Model Context Protocol（MCP）](https://modelcontextprotocol.io/)の JSON 対応を実装し、AI アシスタント機能を大幅に拡張できるようになりました。これにより、様々な外部ツールと Cursor の AI を連携させることが可能になりました。

しかし、MCP サーバーの導入はまだ情報が限られており、セットアップが煩雑です。そこで、私は複数の有用な MCP サーバーを簡単に導入できるリポジトリ「[MCP for Cursor](https://github.com/sorein-mio/MCP_for_Cursor)」を作成しました。

この記事では、MCP の概要から、このリポジトリを使った導入方法、各 MCP サーバーの具体的な使い方までを解説します。

## Model Context Protocol (MCP)とは？

Model Context Protocol（MCP）は、Anthropic 社が開発した、LLM（大規模言語モデル）アプリケーションと外部データソースやツールを連携させるためのオープンプロトコルです。

簡単に言えば、AI に「外の世界とやり取りする能力」を与えるための標準化された方法です。これにより：

- AI がファイルシステムにアクセス
- データベースへのクエリ実行
- Docker コンテナの操作
- GitHub リポジトリの管理

など、様々な操作が可能になります。

Cursor IDE がいち早く MCP をサポートしたことで、AI 開発アシスタントがこれらの外部ツールと連携できるようになりました。

## MCP for Cursor リポジトリの概要

私が作成した[MCP for Cursor](https://github.com/sorein-mio/MCP_for_Cursor)リポジトリは、以下の機能を提供します：

1. **複数の MCP サーバーの一括セットアップ**

   - Docker 操作用 MCP
   - ファイルシステム操作用 MCP
   - GitHub 操作用 MCP
   - テキストエディタ用 MCP（Python 3.13 以上が必要）

2. **Cursor 向け自動設定ファイル**

   - `.cursor/mcp.json`が自動的に設定される

3. **簡単なセットアップスクリプト**
   - PowerShell 用インストールスクリプト

## セットアップ方法

### 前提条件

以下のソフトウェアがインストールされている必要があります：

- Python 3.12 以上（docker-mcp 用）
- Node.js 18 以上（Node.js 20 以上推奨）
- npm 9 以上
- Git
- Docker（docker-mcp を使用する場合）

### 手順

1. リポジトリをクローン

```bash
git clone https://github.com/sorein-mio/MCP_for_Cursor.git
cd MCP_for_Cursor
```

2. リポジトリ内のセットアップスクリプトを実行

```powershell
# PowerShellで実行
./setup-mcp-servers.ps1
./setup-typescript-servers.ps1
```

3. Cursor でプロジェクトを開く
   - Cursor を起動し、クローンしたリポジトリフォルダを開きます
   - Cursor は自動的に`.cursor/mcp.json`を検出し、MCP サーバーを使用可能にします

## 導入済み MCP サーバーの活用例

### 1. Docker 操作用 MCP

この MCP サーバーを使うと、Cursor の AI アシスタントが Docker コンテナの操作を直接行えるようになります。

**使用例**：

- コンテナのリスト表示
- イメージの管理
- コンテナの起動/停止
- Dockerfile の作成支援とビルド

```
# Dockerコンテナの操作例
コンテナをリストアップし、停止中のものを起動してください
```

### 2. ファイルシステム操作用 MCP

AI がファイルシステムを直接操作できるようにします。

**使用例**：

- ファイル一覧の取得
- ファイル内容の読み取り
- ファイルの作成・編集
- ディレクトリの作成・削除

```
# ファイル操作例
現在のディレクトリ内のJavaScriptファイルを検索し、内容を表示してください
```

### 3. GitHub 操作用 MCP

GitHub リポジトリの操作を AI が直接行えるようにします。

**使用例**：

- リポジトリ情報の取得
- イシューの管理
- PR の確認・作成
- コミット履歴の参照

```
# GitHub操作例
このリポジトリの直近5件のコミット内容を教えてください
```

### 4. テキストエディタ用 MCP（Python 3.13 以上が必要）

テキストファイルの編集機能を強化します。

**使用例**：

- 高度なテキスト変換
- ファイル内検索・置換
- 構文解析と編集

```
# テキスト編集例
このファイル内の全ての関数名をキャメルケースに変換してください
```

## トラブルシューティング

MCP サーバーが動作しない場合のトラブルシューティング手順：

1. ターミナルから手動でサーバーを起動して、エラーメッセージを確認

```powershell
# Docker MCP
cd mcp-repos/docker-mcp
python -m docker_mcp

# Filesystem MCP
cd mcp-repos/servers/src/filesystem
npx ts-node index.ts
```

2. 依存関係の問題を確認

```powershell
# Pythonの依存関係
pip list

# Node.jsの依存関係
cd mcp-repos/servers/src/filesystem
npm list
```

3. Node.js や Python のバージョンアップが必要な場合は、リポジトリ内の以下のスクリプトを使用

```powershell
# Python 3.13のインストール（mcp-text-editor用）
./install-latest-python.ps1

# Node.jsの更新
./install-latest-nodejs.ps1
```

## 実際の使用例: MCP を活用したコーディング体験

Cursor IDE で MCP サーバーを導入すると、以下のような体験が可能になります：

**例 1: Docker コンテナの管理**

AI アシスタントに「現在実行中の Docker コンテナの状態を確認して、使用していないイメージを削除してください」と指示するだけで、AI が Docker 環境を整理してくれます。

**例 2: ファイル操作の自動化**

「このプロジェクト内のすべての JavaScript ファイルから、console.log ステートメントを削除してください」という指示で、AI がファイルシステムを検索・編集できます。

**例 3: GitHub との連携**

「最近の Pull Request をレビューして、共通の問題点をまとめてください」と依頼すれば、AI が GitHub API を通じて情報を収集・分析できます。

## まとめと今後の展望

Model Context Protocol（MCP）は、AI アシスタントの能力を大幅に拡張する革新的な技術です。Cursor がこれをサポートしたことで、開発者はよりパワフルな AI アシスタントの恩恵を受けることができます。

「MCP for Cursor」リポジトリを使えば、複数の MCP サーバーを簡単に導入できるため、すぐにこの新しい機能を試すことができます。

今後の展望としては：

1. **より多くの MCP サーバーの追加**

   - データベース操作用 MCP
   - AWS/Azure などクラウドサービス操作用 MCP
   - CI/CD パイプライン操作用 MCP

2. **カスタム MCP サーバー作成ガイド**

   - 独自の MCP サーバーを作成するためのテンプレートとガイド

3. **ユースケース別の設定例**
   - 言語/フレームワーク別の最適な MCP 設定

もし興味があれば、[GitHub リポジトリ](https://github.com/sorein-mio/MCP_for_Cursor)をチェックしてみてください。コントリビューションも歓迎しています！

## 参考リンク

- [Model Context Protocol 公式ドキュメント](https://modelcontextprotocol.io/docs/)
- [Cursor MCP ドキュメント](https://docs.cursor.com/context/model-context-protocol)
- [docker-mcp リポジトリ](https://github.com/QuantGeekDev/docker-mcp)
- [MCP Servers リポジトリ](https://github.com/modelcontextprotocol/servers)
