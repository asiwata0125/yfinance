# Google Apps Script 使用例 (Usage Examples)

## Google Spreadsheet での使用例

### 例 1: 単一の銘柄と年を指定

セル A1 に以下を入力：
```
=getEarningsStockPrice("AAPL", 2023)
```

結果（複数行で表示）:
```
A1: Earnings Date     | B1: Stock Price (Close)
A2: 2023-11-02       | B2: 171.88
A3: 2023-08-03       | B3: 181.99
A4: 2023-05-04       | B4: 169.59
A5: 2023-02-02       | B5: 154.50
```

### 例 2: 複数の銘柄を比較

| A | B | C | D |
|---|---|---|---|
| 1 | Ticker | Year | Function |
| 2 | AAPL | 2023 | =getEarningsStockPrice(A2, B2) |
| 3 | MSFT | 2023 | =getEarningsStockPrice(A3, B3) |
| 4 | GOOGL | 2023 | =getEarningsStockPrice(A4, B4) |

### 例 3: 日本株の使用例

```
=getEarningsStockPrice("7203.T", 2023)    // トヨタ自動車
=getEarningsStockPrice("9984.T", 2023)    // ソフトバンクグループ
=getEarningsStockPrice("6758.T", 2023)    // ソニーグループ
```

### 例 4: 異なる年のデータを取得

```
=getEarningsStockPrice("AAPL", 2022)
=getEarningsStockPrice("AAPL", 2023)
=getEarningsStockPrice("AAPL", 2024)
```

## Apps Script コードのセットアップ手順（詳細）

### ステップ 1: Google Spreadsheet を開く

1. Google Drive にアクセス
2. 「新規」→「Google スプレッドシート」をクリック
3. または既存のスプレッドシートを開く

### ステップ 2: Apps Script エディタを開く

1. スプレッドシートのメニューから「拡張機能」をクリック
2. 「Apps Script」を選択
3. 新しいタブで Apps Script エディタが開きます

### ステップ 3: コードを貼り付け

1. `GoogleAppsScript.js` ファイルの全内容をコピー
2. Apps Script エディタの `Code.gs` タブに貼り付け
3. 既存のコード（`function myFunction() {...}`）は削除してOK
4. Ctrl+S（または Cmd+S）で保存
5. プロジェクト名を入力（例: "Stock Price at Earnings"）

### ステップ 4: 初回実行と権限の承認

1. スプレッドシートに戻る
2. セルに `=getEarningsStockPrice("AAPL", 2023)` と入力
3. 「このアプリは確認されていません」という警告が表示されたら：
   - 「詳細」をクリック
   - 「{プロジェクト名}（安全ではないページ）に移動」をクリック
   - 「許可」をクリック
4. スクリプトが実行され、データが表示されます

## よくある質問 (FAQ)

### Q1: 関数が動作しない / #ERROR! が表示される

**A:** 以下を確認してください：
- Apps Script のコードが正しく保存されているか
- 銘柄コードが正しいか（大文字小文字は区別されません）
- 年が有効な範囲か（1900-2100）
- インターネット接続が有効か

### Q2: "N/A" が表示される

**A:** 以下の可能性があります：
- その日は市場が休場だった
- 決算発表日が取引日でなかった
- データが Yahoo Finance で利用できない

### Q3: データの更新頻度は？

**A:** 
- セルを再計算すると最新データを取得します
- 手動で更新: セルを選択 → Ctrl+Alt+Shift+F9（全てを再計算）
- 自動更新は Google Sheets の仕様により不定期です

### Q4: 過去何年分のデータが取得できる？

**A:** 
- Yahoo Finance が保持しているデータによります
- 通常、10年以上前のデータも取得可能です
- コード内の `size` パラメータで最大100件の決算データを取得します

### Q5: 複数年のデータを一度に取得できる？

**A:** 
現在の実装では1年ずつです。複数年取得したい場合：

```javascript
// カスタム関数を追加（Apps Script に追加）
function getEarningsMultipleYears(ticker, startYear, endYear) {
  var results = [["Earnings Date", "Stock Price (Close)"]];
  
  for (var year = startYear; year <= endYear; year++) {
    var yearData = getEarningsStockPrice(ticker, year);
    // ヘッダー行をスキップして結合
    for (var i = 1; i < yearData.length; i++) {
      results.push(yearData[i]);
    }
  }
  
  return results;
}
```

使用例:
```
=getEarningsMultipleYears("AAPL", 2021, 2023)
```

## 応用例

### 例: 決算後の株価変動を分析

1. 列A: 決算日
2. 列B: 決算日の終値（この関数で取得）
3. 列C: 決算翌日の終値（別途取得）
4. 列D: 変動率 = (C2-B2)/B2*100

### 例: 自動更新されるダッシュボード

```
// セルの配置例
A1: "銘柄"
B1: "年"
C1: "決算データ"

A2: AAPL
B2: 2023
C2: =getEarningsStockPrice(A2, B2)

A3: MSFT
B3: 2023
C3: =getEarningsStockPrice(A3, B3)
```

## パフォーマンスの最適化

### キャッシュの活用

Google Apps Script は自動的にキャッシュしますが、手動でキャッシュを管理することも可能：

```javascript
// Apps Script に追加
var cache = CacheService.getScriptCache();

function getCachedEarningsData(ticker, year) {
  var cacheKey = ticker + "_" + year;
  var cached = cache.get(cacheKey);
  
  if (cached != null) {
    return JSON.parse(cached);
  }
  
  var data = getEarningsStockPrice(ticker, year);
  cache.put(cacheKey, JSON.stringify(data), 21600); // 6時間キャッシュ
  
  return data;
}
```

### バッチ処理

多数の銘柄を処理する場合：

```javascript
// Apps Script に追加
function batchGetEarnings(tickers, year) {
  var results = [];
  
  tickers.forEach(function(ticker) {
    try {
      var data = getEarningsStockPrice(ticker, year);
      results.push([ticker, data]);
    } catch (e) {
      results.push([ticker, "Error: " + e.message]);
    }
    
    // Yahoo Finance の負荷を軽減するため、少し待機
    Utilities.sleep(1000);
  });
  
  return results;
}
```

## トラブルシューティング

### エラー: "Exception: Request failed for https://..."

**原因:** ネットワークエラー、または Yahoo Finance が応答しない

**対処法:**
1. 少し時間をおいて再実行
2. 銘柄コードを確認
3. Apps Script の割り当て量を確認（Apps Script ダッシュボード）

### エラー: "ReferenceError: getEarningsStockPrice is not defined"

**原因:** 関数が Apps Script に保存されていない

**対処法:**
1. Apps Script エディタを開く
2. コードが正しく保存されているか確認
3. 保存後、スプレッドシートをリロード

### データが古い

**対処法:**
1. セルを選択して Delete キーで削除
2. 再度数式を入力
3. または Ctrl+Alt+Shift+F9 で全てを再計算

## セキュリティとプライバシー

### データの取り扱い

- このスクリプトは外部（Yahoo Finance）にリクエストを送信します
- 入力した銘柄コードと年の情報が Yahoo Finance に送信されます
- 個人情報や機密情報は含まれません

### 権限について

スクリプトが要求する権限：
- **外部サービスへの接続**: Yahoo Finance API へのアクセスに必要
- **スプレッドシートの読み取り**: 入力パラメータの取得に必要

### 推奨事項

- 個人アカウントでのみ使用
- 企業の機密情報には使用しない
- データの正確性を自身で検証する

---

**最終更新**: 2024年
**バージョン**: 1.0
**互換性**: Google Apps Script (V8 Runtime)
