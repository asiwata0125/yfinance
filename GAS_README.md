# Google Apps Script for Yahoo Finance Stock Prices at Earnings Dates

このドキュメントは、Google Spreadsheetで使用できるカスタム関数の説明です。Yahoo Finance APIを活用して、指定した銘柄の決算発表日における株価を取得します。

## 概要

このGoogle Apps Script（GAS）は、以下の機能を提供します：

1. **銘柄コード（ティッカーシンボル）と年を指定**して、その年の決算発表日を取得
2. **各決算発表日時点での株価（終値）**を取得
3. **Google Spreadsheet上で関数として利用可能**

## セットアップ手順

### 1. Google Spreadsheetを開く

新しいGoogle Spreadsheetを作成するか、既存のスプレッドシートを開きます。

### 2. Apps Scriptエディタを開く

1. メニューから「拡張機能」→「Apps Script」を選択
2. Apps Scriptエディタが開きます

### 3. コードを追加

1. `GoogleAppsScript.js` ファイルの内容をコピー
2. Apps Scriptエディタのデフォルトの `Code.gs` にペースト
3. 「保存」アイコンをクリックして保存

### 4. 承認

初回実行時に、スクリプトの実行許可を求められます：

1. 関数を実行すると権限の承認を求められます
2. 「権限を確認」をクリック
3. Googleアカウントを選択
4. 「詳細」→「安全ではないページに移動」をクリック（必要な場合）
5. 「許可」をクリック

## 使用方法

### 基本的な使い方

Google Spreadsheetのセルに以下のように入力します：

```
=getEarningsStockPrice("AAPL", 2023)
```

#### パラメータ説明

- **第1引数（ticker）**: 銘柄コード（ティッカーシンボル）
  - 例: `"AAPL"` (Apple), `"MSFT"` (Microsoft), `"GOOGL"` (Google)
  - 日本株の場合: `"7203.T"` (トヨタ), `"9984.T"` (ソフトバンクグループ)

- **第2引数（year）**: 取得したい年
  - 例: `2023`, `2024`

### 使用例

#### 例1: Appleの2023年の決算時株価

```
=getEarningsStockPrice("AAPL", 2023)
```

**結果例:**
```
Earnings Date     | Stock Price (Close)
2023-11-02       | 171.88
2023-08-03       | 181.99
2023-05-04       | 169.59
2023-02-02       | 154.50
```

#### 例2: Microsoftの2024年の決算時株価

```
=getEarningsStockPrice("MSFT", 2024)
```

#### 例3: 日本株（トヨタ）の2023年の決算時株価

```
=getEarningsStockPrice("7203.T", 2023)
```

## 戻り値

関数は2次元配列を返します：

| 列 | 内容 |
|---|------|
| 1列目 | 決算発表日 (YYYY-MM-DD形式) |
| 2列目 | その日の終値 |

## 主要な機能

### 1. `getEarningsStockPrice(ticker, year)`

指定した銘柄と年の決算発表日と株価を取得します。

**引数:**
- `ticker` (string): 銘柄コード
- `year` (number): 年

**戻り値:**
- 2次元配列: `[["決算日", "株価"], ...]`

### 2. `getStockPriceOnDate(ticker, dateStr)`

指定した日付の株価を取得します（内部関数）。

**引数:**
- `ticker` (string): 銘柄コード
- `dateStr` (string): 日付文字列

**戻り値:**
- `number`: 終値、またはデータがない場合は "N/A"

### 3. `getEarningsDates(ticker)`

Yahoo Financeから決算日を取得します（内部関数）。

**引数:**
- `ticker` (string): 銘柄コード

**戻り値:**
- `Array`: 決算日オブジェクトの配列

## 技術仕様

### 使用API

1. **Yahoo Finance Calendar API**
   - URL: `https://finance.yahoo.com/calendar/earnings?symbol={ticker}`
   - 用途: 決算発表日の取得

2. **Yahoo Finance Chart API (v8)**
   - URL: `https://query2.finance.yahoo.com/v8/finance/chart/{ticker}`
   - 用途: 株価データの取得

### データ取得の仕組み

1. Yahoo Finance Calendar APIから決算発表日を取得
2. 指定された年でフィルタリング
3. 各決算日について、前後3日間の株価データを取得
4. 最も近い取引日の終値を返す

### エラーハンドリング

- 無効な銘柄コード: エラーメッセージを表示
- 無効な年: エラーメッセージを表示
- データ取得失敗: "N/A" を表示
- HTTPエラー: エラーステータスをログに記録

## 制限事項

1. **Yahoo Finance API の制限**
   - Yahoo Finance は公式APIを提供していないため、将来的に動作しなくなる可能性があります
   - 過度なリクエストはIPアドレスがブロックされる可能性があります

2. **Google Apps Script の制限**
   - 1日あたりの実行時間: 6分（無料アカウント）
   - URLFetch の呼び出し: 1日20,000回まで

3. **データの精度**
   - 決算発表日が休日や週末の場合、最も近い取引日のデータを使用します
   - 過去のデータのみ取得可能（未来の株価は取得できません）

## トラブルシューティング

### エラー: "Failed to fetch earnings data"

- 銘柄コードが正しいか確認してください
- Yahoo Finance でその銘柄が利用可能か確認してください

### エラー: "No earnings data found for year XXXX"

- 指定した年にその銘柄の決算発表がなかった可能性があります
- 年の値が正しいか確認してください

### "N/A" が表示される

- その日の株価データが取得できませんでした
- 市場が休場だった可能性があります
- 銘柄が上場廃止になっている可能性があります

## カスタマイズ

### 取得期間の変更

`getEarningsDates()` 関数内の `size` パラメータを変更することで、取得する決算数を変更できます：

```javascript
const url = "https://finance.yahoo.com/calendar/earnings?symbol=" + ticker + "&offset=0&size=100";
// size=100 を size=200 に変更すると、より多くの過去データを取得
```

### 日付フォーマットの変更

`getEarningsStockPrice()` 関数内のフォーマット文字列を変更できます：

```javascript
Utilities.formatDate(earningsDate, Session.getScriptTimeZone(), "yyyy-MM-dd")
// "yyyy/MM/dd" や "MM/dd/yyyy" など、お好みの形式に変更可能
```

## ライセンスと免責事項

- このスクリプトはyfinanceプロジェクトの一部として提供されています
- Yahoo Finance のAPIを使用していますが、Yahoo社とは無関係です
- **個人の調査・研究目的でのみ使用してください**
- データの正確性については保証できません
- 投資判断は自己責任で行ってください

## サポート

問題や質問がある場合は、yfinanceプロジェクトのGitHubリポジトリでIssueを作成してください。

---

**作成日**: 2025年
**対応言語**: JavaScript (Google Apps Script)
**必要な権限**: 外部サービスへの接続
