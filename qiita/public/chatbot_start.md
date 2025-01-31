---
title: 【OpenAI API × TypeScript】インタラクティブなチャットボットの開発
tags:
  - TypeScript
  - React
  - 個人開発
  - OpenAI
private: false
updated_at: '2025-01-31T18:36:24+09:00'
id: ff145b1b8e310ee0ee66
organization_url_name: null
slide: false
ignorePublish: false
---


# OpenAI API × TypeScriptでインタラクティブなチャットボットを開発

https://github.com/sorein-mio/chatbot

## はじめに

OpenAI APIを活用したインタラクティブなチャットボットアプリケーションを開発したので、ここに記録として残します。

TypeScriptとReactを使用して構築され、マークダウン形式での応答をサポートしています。

## デモ画面

### チャットインターフェース
![チャットボットのメイン画面](/images/chatbot_start/chat-screen.png)

シンプルで使いやすいインターフェースを心がけました。マークダウン形式での表示やコードブロックにも対応し、プログラミング関連の会話も快適に行えます。

### モデル選択機能
![モデル選択画面](/images/chatbot_start/model-selection.png)

用途や予算に応じて最適なモデルを選択できます。
GPT-4やGPT-3.5-turboなど、複数のモデルに対応しています。
また、マウスホバーでモデルの詳細や料金も表示されます。

## 主な機能

- OpenAI APIを活用したインテリジェントな応答
- 複数のGPTモデル対応（gpt-4o, gpt-4o-mini, gpt-3.5-turbo）
- マークダウン形式でのリッチテキスト表示
- レスポンシブデザイン（ウィンドウサイズ切り替え対応）
- リアルタイムのローディング表示
- 自動スクロールによる快適な会話体験

## 技術スタック

- TypeScript
- React
- Webpack
- CSS Modules
- Axios
- Marked（マークダウンパーサー）

## 実装の工夫点

### 1. 型安全なメッセージ管理

```typescript
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
```

TypeScriptの型システムを活用して、メッセージの構造を明確に定義しています。
これにより実行時エラーを防ぎ、開発時の補完機能も活用できます。

### 2. カスタムフックによる状態管理

```typescript
const useChatState = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });

  const addMessage = useCallback((message: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { ...message, timestamp: Date.now() }]
    }));
  }, []);

  return { state, addMessage };
};
```

カスタムフックを使用することで、チャットの状態管理ロジックを再利用可能な形で分離しています。

### 3. エラーハンドリングの実装

```typescript
const handleSendMessage = async (content: string) => {
  try {
    setIsLoading(true);
    const response = await sendMessage(content);
    addMessage({
      role: 'assistant',
      content: response.choices[0].message.content
    });
  } catch (error) {
    setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
  } finally {
    setIsLoading(false);
  }
};
```

try-catch-finallyパターンを使用して、API通信の例外処理を適切に行い、ユーザーにフィードバックを提供しています。

### 4. マークダウンレンダリングの最適化

```typescript
const MessageContent: React.FC<{ content: string }> = memo(({ content }) => {
  const html = useMemo(() => {
    return marked(content, {
      gfm: true,
      breaks: true,
      sanitize: true
    });
  }, [content]);

  return <div className={styles.message} dangerouslySetInnerHTML={{ __html: html }} />;
});
```

- `useMemo`を使用してマークダウンのパース処理を最適化
- `memo`でコンポーネントの不要な再レンダリングを防止
- XSS対策として`sanitize`オプションを有効化

### 5. レスポンシブ対応のスタイリング

```css
.chatContainer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

@media (max-width: 768px) {
  .chatContainer {
    padding: 0.5rem;
    height: calc(100vh - 60px); /* モバイルブラウザのUIを考慮 */
  }
}
```

CSSメディアクエリを使用して、デバイスサイズに応じた最適なレイアウトを提供しています。

### 6. パフォーマンス最適化

```typescript
const ChatHistory: React.FC<{ messages: Message[] }> = memo(({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.history}>
      {messages.map((msg, idx) => (
        <MessageBubble key={msg.timestamp ?? idx} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
});
```

- 仮想スクロールの実装検討（メッセージ数が多い場合）
- `useRef`を使用した効率的なDOM操作
- メッセージの一意性を保証するためのタイムスタンプ活用

### 7. セキュリティ対策

```typescript
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
if (!API_KEY) {
  throw new Error('OpenAI API key is not configured');
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`,
  'X-Request-ID': crypto.randomUUID()
};
```

- 環境変数による機密情報の管理
- リクエストヘッダーでのセキュリティ強化
- ユニークなリクエストIDによるトレーサビリティの確保

## 開発時の課題と解決策

1. **APIレートリミット対策**
   - デバウンス処理の実装
   - エラー時の再試行ロジック
   - ユーザーへの適切なフィードバック

2. **レスポンス時間の最適化**
   - ストリーミングレスポンスの実装
   - プログレッシブローディングの導入
   - キャッシュ戦略の検討

3. **UX改善**
   - タイピングインジケーターの実装
   - エラー状態の視覚的フィードバック
   - ショートカットキーのサポート

## 開発プロセスでの工夫

### 開発効率の向上

開発プロセスでは、以下のようなツールや手法を活用して効率化を図りました：

1. **コード品質の維持**
   - ESLintとPrettierによる一貫したコードスタイルの維持
   - GitHub Actionsによる自動テストとビルド
   - AIアシスタントを活用したコードレビューと改善提案

2. **ドキュメント管理**
   - TypeDocによるAPI文書の自動生成
   - AIツールを活用した文書校正と翻訳支援
   - マークダウンベースの技術文書管理

3. **イテレーティブな開発**
   - 小規模な機能から段階的に実装
   - フィードバックループの短縮化
   - AIによるコード提案を参考にした実装の最適化

これらのツールや手法を組み合わせることで、開発効率を向上させながら、コードの品質維持を実現しています。

## プロジェクト構造
```
/
├── dist/ # ビルド出力ディレクトリ
├── docs/ # ドキュメント関連ファイル
│ └── images/ # スクリーンショットなどの画像
├── src/ # ソースコードディレクトリ
│ ├── index.tsx # Reactアプリケーションのエントリーポイント
│ ├── components/ # Reactコンポーネント
│ │ └── Chatbot.tsx # チャットボットメインコンポーネント
│ ├── config/ # 設定ファイル
│ │ └── models.ts # モデル設定
│ └── styles/ # コンポーネント固有のスタイル
│ └── Chatbot.css # チャットボットのスタイル
├── .env.example # 環境変数テンプレート
├── .env # 環境変数（非公開）
├── .gitignore # Git除外設定
├── package.json # プロジェクト設定・依存関係
├── package-lock.json # 依存関係のロックファイル
├── README.md # プロジェクト説明
├── requirements.md # 要件定義
├── tsconfig.json # TypeScript設定
└── webpack.config.js # Webpack設定
```

## セットアップガイド

### インストールと起動方法

1. リポジトリをクローン
   ```bash
   git clone https://github.com/sorein-mio/chatbot.git
   cd chatbot
   ```

2. 依存関係のインストール
   ```bash
   npm install
   ```

3. 環境変数の設定
   - `.env.example`をコピーして`.env`を作成
   - OpenAI APIキーを設定

4. 開発サーバーの起動
   ```bash
   npm start
   ```

アプリケーションは `http://localhost:8080` で起動します。

## セキュリティ注意事項

APIキーは`.env`ファイルで管理し、GitHubにはコミットしないでください。本番環境では適切な環境変数管理を行ってください。

## 今後の展望

- チャット履歴の永続化
- プロンプトテンプレート機能
- ファイル添付機能
- 最新モデルの対応
- モデルの単価などの自動更新機能

## ライセンスと貢献

このプロジェクトはISCライセンスで公開しています。貢献を歓迎しますので、プルリクエストをお待ちしています。

