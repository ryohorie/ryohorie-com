# ryohorie.com

堀江 良のプロフィールサイト。Astroで静的HTMLを生成し、Firebase Hostingで配信します。

## 開発

Node.js 24 LTSを推奨します（Astroの動作要件は22.12.0以上）。`.nvmrc`とGitHub ActionsはNode.js 24に揃えています。

```sh
nvm use
npm ci
npm run dev
```

開発サーバーは通常 `http://localhost:4321` で起動します。`npm start` / `npm run develop` も同じコマンドです。

## 確認・ビルド

```sh
npm run check         # Astro / TypeScriptの診断
npm run format:check  # フォーマット確認
npm test              # 本番ビルドと生成HTMLの回帰テスト
npm run preview       # dist/のプレビュー
```

`npm run build` は本番用ファイルを `dist/` に生成します。`npm run serve` は `preview` の別名です。`npm run format` で整形、`npm run clean` で生成物（`dist/` と `.astro/`）を削除できます。

テストではプロフィール・アプリ・動画・外部リンクの保持、SEOメタデータ、画像・CSSの参照、JavaScript不要の出力、404とFirebaseの配信設定を確認します。外部YouTube動画の再生可否は配信元に依存し、このテストの対象には含みません。

## 構成

- `src/pages/index.astro`: トップページとレスポンシブレイアウト
- `src/pages/404.astro`: 日本語の404ページ
- `src/layouts/Layout.astro`: 共通HTML、SEO、ヘッダー、フッター
- `src/components/`: YouTube埋め込みとSNSリンク
- `src/data/profile.ts`: プロフィール、アプリ一覧、動画ID、外部リンク
- `src/styles/global.css`: 共通スタイル
- `public/images/`: アプリ画像とOGP画像（URLは従来どおり `/images/...`）
- `tests/site.test.mjs`: 生成HTMLに対する回帰テスト

コンテンツの変更は主に `src/data/profile.ts` で行います。公開URLは `astro.config.mjs` の `site` に設定しています。OGP画像には実在する `public/images/ogp.jpeg` を使い、メタデータには絶対URLを出力します。

## デプロイ

既存のFirebaseプロジェクト `ryohorie-com` とGitHub Actionsを継続利用します。`firebase.json` の公開ディレクトリは `dist` です。サーバー用アダプターやSPA用リライトは不要です。

- 同一リポジトリからのPR: 検証成功後にFirebaseのプレビューチャンネルへデプロイ
- `main` へのpush: 検証成功後にFirebase Hosting本番へデプロイ

両ワークフローは `npm ci`、フォーマット確認、Astroの診断、本番ビルドとテストを実行します。既存の `FIREBASE_SERVICE_ACCOUNT_RYOHORIE_COM` シークレットを利用します。

Firebase CLIが設定済みの環境で手動公開する場合:

```sh
npm ci
npm run format:check
npm run check
npm test
firebase deploy --only hosting --project ryohorie-com
```

## Gatsbyからの移行

プロフィール、4つのアプリ紹介、ヒーロー動画と6本の演奏動画、SNSリンク、元の画像と基本レイアウトを引き継いでいます。React、MUI、Emotion、Gatsbyの実行時依存はAstroコンポーネントとCSSへ置き換えました。ページ自体が配信するJavaScriptはありません（YouTubeの埋め込み内部を除く）。

Gatsbyスターターのサンプルルート `/page-2`、`/using-typescript`、`/using-ssr`、`/using-dsg` と、スターター用アイコン・マニフェストは削除しました。これらのURLは通常の404になります。

参考: [AstroのGatsby移行ガイド](https://docs.astro.build/en/guides/migrate-to-astro/from-gatsby/)、[Firebase Hostingへのデプロイ](https://docs.astro.build/en/guides/deploy/firebase/)。
