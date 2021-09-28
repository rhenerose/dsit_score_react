# 演習課題提出用フロントエンドページ

演習課題提出用フロントエンドページです。  
いかの機能を含んでいます。  

- CSVプレビュー
- CSVアップロード＆スコア算出
- スコア提出
- ランキング機能

## Requirement

- node: v14.17.6
- npm: 6.14.15

### 主なモジュール (package.jsonに含む)

- typescript: 4.4.3
- react: 17.0.2
- material-ui/core: 4.12.3
- react-dropzone: 11.3.4

## 開発環境

下記コマンドを実行してソースのクローンおよび依存パッケージのインストールを行ってください。  
( `<workspace_path>` は自分の環境に合わせて変更してください)

なお、開発は `VSCode` + `Google Chrome` を想定しています。  

```bash
# リポジトリのクローン
git clone https://github.com/rhenerose/dsit_score_react <workspace_path>

# ワークスペースの移動
cd <workspace_path>

# 依存モジュールのインストール
npm install

# VSCodeの起動
code ./
```

下記記事を参考にVSCodeの `task.json` と `launch.json` を構成すると、VSCodeからChromeを起動してデバッグを行えるようになります。

[VSCode+GoogleChromeでReactのデバッグを行う](https://zenn.dev/rhene/articles/setup-vscode-to-react-debug)

[task.json の作成](https://zenn.dev/rhene/articles/setup-vscode-to-react-debug#2.-task.json-%E3%81%AE%E4%BD%9C%E6%88%90)

[launch.json の作成](https://zenn.dev/rhene/articles/setup-vscode-to-react-debug#3.-launch.json-%E3%81%AE%E4%BD%9C%E6%88%90)
