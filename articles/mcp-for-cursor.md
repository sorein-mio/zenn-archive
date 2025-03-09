---
title: "CursorのMCPサーバーがjson対応したので使いそうな機能をまとめたリポジトリを作成してみた"
emoji: "📚"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["cursor", "mcp", "ai", "開発ツール", "エディタ"]
published: true
---

# Cursor の MCP サーバーが JSON 対応したので便利機能をまとめたリポジトリを作りました

> 🔄 **2025 年 2 月 28 日更新**: WSL 環境での MCP サーバーの実行に対応しました。WSL ユーザーの方は、新しく追加された`setup-mcp-servers-wsl.sh`スクリプトを使用してセットアップできるようになりました。

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

Cursor は IDE としていち早く MCP をサポートし、AI アシスタントがこれらの外部ツールを活用できるようになりました。

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

#### WSL 環境を使用する場合の追加要件

- WSL2
- Ubuntu 20.04 LTS 以上（推奨）

### 手順

1. リポジトリをクローン

   ```bash
   git clone https://github.com/sorein-mio/MCP_for_Cursor.git
   cd MCP_for_Cursor
   ```

2. リポジトリ内のセットアップスクリプトを実行

   ```powershell
   # Windows PowerShellで実行する場合
   ./setup-mcp-servers.ps1
   ./setup-typescript-servers.ps1

   # WSL環境で実行する場合
   chmod +x setup-mcp-servers-wsl.sh
   ./setup-mcp-servers-wsl.sh
   ```

3. Cursor でプロジェクトを開く
   - Cursor を起動し、クローンしたリポジトリフォルダを開きます
   - Cursor は自動的に`.cursor/mcp.json`を検出し、MCP サーバーを使用可能にします

### WSL 環境でのセットアップに関する注意点

- WSL2 を使用していることを確認してください（`wsl -l -v`で確認可能）
- WSL 環境内で Node.js と Python をインストールすることを推奨します
- Docker MCP を使用する場合は、WSL2 上の Docker を使用することができます

### WSL 環境向けセットアップスクリプトの詳細

**setup-mcp-servers-wsl.sh**  
WSL 環境向けの Bash スクリプトです。このスクリプトは以下の処理を行います:

1. **WSL 環境の検出**  
   スクリプト開始時に、現在の環境が WSL であるかを確認します。

2. **apt リポジトリの更新と依存関係のインストール**  
   apt を使用してリポジトリの更新を行い、Node.js および Python3 のインストール状況を確認します。足りない場合は自動的にインストールを試みます。

3. **MCP サーバーのセットアップ**  
   指定された MCP サーバー（例: docker-mcp、mcp-text-editor）のディレクトリ内で、各種ビルドおよびセットアップ処理（npm install や pip install 等）を実行します。

4. **Python バージョンのアップグレード (オプション)**  
   mcp-text-editor など、一部のサーバーでは Python 3.13 以上が必要です。オプション `--upgrade-python` を指定して実行すると、pyenv を使用してユーザーレベルで Python のアップグレード（例：3.13.0 のインストール）が試みられます。

### WSL 環境での実行方法

**基本的なセットアップ**  
WSL 環境で次のコマンドを実行してください:

```bash
bash setup-mcp-servers-wsl.sh
```

**Python のアップグレード (必要に応じて)**  
mcp-text-editor のセットアップで Python バージョンが不足している場合、以下のコマンドで Python のアップグレードが可能です:

```bash
bash setup-mcp-servers-wsl.sh --upgrade-python
```

このオプションは、pyenv を自動でインストール・設定し、指定されたバージョン（例: 3.13.0）の Python をインストールしてから、グローバル環境に設定します。  
※ pyenv 使用時には、シェルの初期化ファイルへの設定追加が必要な場合があります。詳細はスクリプト内のコメントを参照してください。

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
# Windows環境でのDocker MCP
cd mcp-repos/docker-mcp
python -m docker_mcp

# Windows環境でのFilesystem MCP
cd mcp-repos/servers/src/filesystem
npx ts-node index.ts

# WSL環境での実行
wsl
cd mcp-repos/docker-mcp
python3 -m docker_mcp
```

2. 依存関係の問題を確認

```powershell
# Windowsでの依存関係確認
pip list
npm list

# WSL環境での依存関係確認
wsl
pip3 list
npm list
```

3. Node.js や Python のバージョンアップが必要な場合は、リポジトリ内の以下のスクリプトを使用

```powershell
# Windows環境
./install-latest-python.ps1
./install-latest-nodejs.ps1

# WSL環境
chmod +x install-latest-python-wsl.sh
./install-latest-python-wsl.sh
```

### WSL 環境特有の問題解決

1. WSL と Windows の連携に関する問題

   - WSL のバージョンが 2 であることを確認：`wsl --version`
   - Windows との統合機能が有効か確認：`wsl --status`

2. パーミッションの問題

   - スクリプトの実行権限を付与：`chmod +x *.sh`
   - 必要に応じて sudo を使用：`sudo ./setup-mcp-servers-wsl.sh`

3. Docker 関連の問題
   - WSL2 上の Docker デーモンの状態確認：`service docker status`
   - 必要に応じて Docker を起動：`sudo service docker start`

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
