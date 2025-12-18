# 期末決算日の株価取得スクリプト

## 概要

このスクリプトは、yfinanceライブラリを使用して、指定した銘柄の期末決算日（会計年度末）における株価を取得します。

## 機能

- 銘柄コードと年を指定して、その年の期末決算日を特定
- 期末決算日時点での株価（終値）を取得
- 米国株、日本株など、Yahoo Financeが対応している全ての市場に対応

## 必要要件

- Python 3.7以上
- yfinanceライブラリ（このリポジトリ）
- pandas
- その他の依存ライブラリ

## インストール

```bash
# このリポジトリのyfinanceをインストール
pip install -e .
```

## 使用方法

### 基本的な使い方

```bash
python get_fiscal_yearend_price.py <銘柄コード> <年>
```

### 使用例

#### 米国株（Apple）の2023年期末決算日の株価

```bash
python get_fiscal_yearend_price.py AAPL 2023
```

出力例:
```
AAPL の 2023年 期末決算日の株価を取得中...

==================================================
銘柄コード: AAPL
期末決算日: 2023-09-30
株価取得日: 2023-09-29
終値: 171.21
==================================================
```

#### 日本株（トヨタ自動車）の2023年期末決算日の株価

```bash
python get_fiscal_yearend_price.py 7203.T 2023
```

#### その他の例

```bash
# Microsoft
python get_fiscal_yearend_price.py MSFT 2023

# ソフトバンクグループ
python get_fiscal_yearend_price.py 9984.T 2023

# ソニーグループ
python get_fiscal_yearend_price.py 6758.T 2023
```

## プログラムからの使用

Pythonプログラムから関数として使用することもできます：

```python
from get_fiscal_yearend_price import get_fiscal_yearend_price

# 株価を取得
result = get_fiscal_yearend_price("AAPL", 2023)

if result:
    print(f"期末決算日: {result['fiscal_yearend']}")
    print(f"終値: {result['close_price']}")
```

戻り値の形式：
```python
{
    'ticker': 'AAPL',
    'fiscal_year': 2023,
    'fiscal_yearend': '2023-09-30',  # 期末決算日
    'price_date': '2023-09-29',      # 実際の株価取得日
    'close_price': 171.21            # 終値
}
```

## 仕様の詳細

### 期末決算日の特定方法

1. yfinanceの`income_stmt`プロパティから年次財務諸表を取得
2. 財務諸表の列名（日付）から、指定された年の期末決算日を特定
3. 期末決算日に最も近い取引日の株価を取得

### データ取得の仕組み

- **期末決算日**: 年次財務諸表の日付から取得
- **株価データ**: 期末決算日の前後5日間のデータを取得し、最も近い日の終値を使用
- **休日対応**: 期末決算日が休日の場合、前後の取引日から最も近い日のデータを使用

### 対応市場

Yahoo Financeが対応している全ての市場で使用可能：
- 米国: `AAPL`, `MSFT`, `GOOGL` など
- 日本: `7203.T`, `9984.T`, `6758.T` など（証券コード + `.T`）
- その他: ヨーロッパ、アジアなど各国市場

## エラーハンドリング

スクリプトは以下のエラーをハンドリングします：

- 無効な銘柄コード
- データが取得できない場合
- 指定された年の期末決算日が見つからない場合
- ネットワークエラー

エラーが発生した場合、適切なエラーメッセージが表示されます。

## 制限事項

1. **データの可用性**
   - Yahoo Financeが提供しているデータに依存します
   - 上場廃止企業や古すぎるデータは取得できない場合があります

2. **期末決算日**
   - 企業の会計年度末の日付を使用します
   - 暦年ではなく、会計年度に基づきます

3. **データの精度**
   - 期末決算日が休日の場合、最も近い取引日のデータを使用します
   - データの正確性はYahoo Financeの提供データに依存します

## トラブルシューティング

### エラー: 財務データが取得できない

銘柄コードが正しいか確認してください。Yahoo Financeで該当銘柄が存在するか確認できます。

### エラー: 期末決算日が見つからない

指定した年の財務データが存在しない可能性があります。利用可能な期末決算日がエラーメッセージに表示されます。

### データが古い

yfinanceのキャッシュが原因の場合があります。以下のコマンドでキャッシュをクリアできます：

```python
import yfinance as yf
yf.Ticker("AAPL")._download_options()  # キャッシュをリフレッシュ
```

## 開発者向け情報

### 関数の詳細

#### `get_fiscal_yearend_price(ticker_symbol, year)`

指定した銘柄の指定年における期末決算日の株価を取得します。

**引数:**
- `ticker_symbol` (str): 銘柄コード（例: "AAPL", "7203.T"）
- `year` (int): 取得したい年（例: 2023）

**戻り値:**
- `dict`: 成功時は期末決算日と株価を含む辞書
- `None`: エラー時

### カスタマイズ

スクリプトは簡単にカスタマイズできます：

```python
# 複数年のデータを取得
for year in range(2020, 2024):
    result = get_fiscal_yearend_price("AAPL", year)
    if result:
        print(f"{year}: {result['close_price']}")

# 複数の銘柄を処理
tickers = ["AAPL", "MSFT", "GOOGL"]
for ticker in tickers:
    result = get_fiscal_yearend_price(ticker, 2023)
    if result:
        print(f"{ticker}: {result['close_price']}")
```

## ライセンス

このスクリプトはyfinanceプロジェクトの一部であり、Apache License 2.0の下で提供されています。

## 免責事項

- このスクリプトは研究・教育目的での使用を想定しています
- データの正確性については保証できません
- 投資判断は自己責任で行ってください
- Yahoo Financeの利用規約を確認してください

## サポート

問題や質問がある場合は、yfinanceプロジェクトのGitHubリポジトリでIssueを作成してください。
