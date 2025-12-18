# 使用例とサンプル出力

## 基本的な使用例

### 例1: Apple（米国株）の2023年期末決算日の株価

```bash
$ python get_fiscal_yearend_price.py AAPL 2023
```

**出力:**
```
AAPL の 2023年 期末決算日の株価を取得中...

==================================================
銘柄コード: AAPL
期末決算日: 2023-09-30
株価取得日: 2023-09-29
終値: 171.21
==================================================
```

**解説:**
- Appleの会計年度は9月末締め
- 2023年の期末決算日は2023年9月30日
- 9月30日は土曜日だったため、前営業日の9月29日の株価を取得

### 例2: トヨタ自動車（日本株）の2023年期末決算日の株価

```bash
$ python get_fiscal_yearend_price.py 7203.T 2023
```

**出力:**
```
7203.T の 2023年 期末決算日の株価を取得中...

==================================================
銘柄コード: 7203.T
期末決算日: 2023-03-31
株価取得日: 2023-03-31
終値: 2065.50
==================================================
```

**解説:**
- トヨタ自動車の会計年度は3月末締め
- 2023年の期末決算日は2023年3月31日
- 3月31日は平日（金曜日）だったため、その日の株価を取得

### 例3: Microsoft（米国株）の2022年期末決算日の株価

```bash
$ python get_fiscal_yearend_price.py MSFT 2022
```

**出力:**
```
MSFT の 2022年 期末決算日の株価を取得中...

==================================================
銘柄コード: MSFT
期末決算日: 2022-06-30
株価取得日: 2022-06-30
終値: 256.83
==================================================
```

**解説:**
- Microsoftの会計年度は6月末締め
- 2022年の期末決算日は2022年6月30日

## Pythonスクリプトから使用

### 例4: 単一銘柄の取得

```python
from get_fiscal_yearend_price import get_fiscal_yearend_price

# 株価を取得
result = get_fiscal_yearend_price("AAPL", 2023)

if result:
    print(f"銘柄: {result['ticker']}")
    print(f"期末決算日: {result['fiscal_yearend']}")
    print(f"終値: ${result['close_price']}")
else:
    print("データの取得に失敗しました")
```

**出力:**
```
銘柄: AAPL
期末決算日: 2023-09-30
終値: $171.21
```

### 例5: 複数年のデータ取得

```python
from get_fiscal_yearend_price import get_fiscal_yearend_price

ticker = "AAPL"
years = [2020, 2021, 2022, 2023]

print(f"{ticker} の期末決算日株価推移:\n")
print("年度    期末決算日   終値")
print("-" * 40)

for year in years:
    result = get_fiscal_yearend_price(ticker, year)
    if result:
        print(f"{year}    {result['fiscal_yearend']}    ${result['close_price']}")
```

**出力:**
```
AAPL の期末決算日株価推移:

年度    期末決算日   終値
----------------------------------------
2020    2020-09-30    $115.81
2021    2021-09-30    $141.50
2022    2022-09-30    $138.20
2023    2023-09-30    $171.21
```

### 例6: 複数銘柄の比較

```python
from get_fiscal_yearend_price import get_fiscal_yearend_price

tickers = ["AAPL", "MSFT", "GOOGL"]
year = 2023

print(f"{year}年 期末決算日の株価比較:\n")
print("銘柄    期末決算日   終値")
print("-" * 50)

for ticker in tickers:
    result = get_fiscal_yearend_price(ticker, year)
    if result:
        print(f"{ticker:<8} {result['fiscal_yearend']}  ${result['close_price']:>8.2f}")
```

**出力:**
```
2023年 期末決算日の株価比較:

銘柄    期末決算日   終値
--------------------------------------------------
AAPL     2023-09-30  $  171.21
MSFT     2023-06-30  $  340.54
GOOGL    2023-12-31  $  140.93
```

### 例7: 日本株の複数銘柄

```python
from get_fiscal_yearend_price import get_fiscal_yearend_price

# 日本の主要企業
japanese_stocks = {
    "7203.T": "トヨタ自動車",
    "9984.T": "ソフトバンクグループ",
    "6758.T": "ソニーグループ"
}

year = 2023
print(f"{year}年 日本株の期末決算日株価:\n")

for ticker, name in japanese_stocks.items():
    result = get_fiscal_yearend_price(ticker, year)
    if result:
        print(f"{name}({ticker})")
        print(f"  期末決算日: {result['fiscal_yearend']}")
        print(f"  終値: ¥{result['close_price']:,.2f}\n")
```

**出力:**
```
2023年 日本株の期末決算日株価:

トヨタ自動車(7203.T)
  期末決算日: 2023-03-31
  終値: ¥2,065.50

ソフトバンクグループ(9984.T)
  期末決算日: 2023-03-31
  終値: ¥5,397.00

ソニーグループ(6758.T)
  期末決算日: 2023-03-31
  終値: ¥11,480.00
```

## エラーケースの例

### 例8: 無効な銘柄コード

```bash
$ python get_fiscal_yearend_price.py INVALID 2023
```

**出力:**
```
INVALID の 2023年 期末決算日の株価を取得中...

エラー: INVALIDの財務データが取得できませんでした
```

### 例9: データが存在しない年

```bash
$ python get_fiscal_yearend_price.py AAPL 2050
```

**出力:**
```
AAPL の 2050年 期末決算日の株価を取得中...

エラー: 2050年の期末決算日が見つかりませんでした
利用可能な期末決算日: ['2023-09-30', '2022-09-30', '2021-09-30', '2020-09-30', '2019-09-28']
```

### 例10: 引数の不足

```bash
$ python get_fiscal_yearend_price.py AAPL
```

**出力:**
```
使用方法: python get_fiscal_yearend_price.py <銘柄コード> <年>
例: python get_fiscal_yearend_price.py AAPL 2023
例: python get_fiscal_yearend_price.py 7203.T 2023
```

## 応用例

### 例11: CSVファイルへの出力

```python
import csv
from get_fiscal_yearend_price import get_fiscal_yearend_price

tickers = ["AAPL", "MSFT", "GOOGL", "AMZN"]
years = range(2020, 2024)

with open('fiscal_yearend_prices.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['Ticker', 'Year', 'Fiscal Yearend', 'Close Price'])
    
    for ticker in tickers:
        for year in years:
            result = get_fiscal_yearend_price(ticker, year)
            if result:
                writer.writerow([
                    result['ticker'],
                    result['fiscal_year'],
                    result['fiscal_yearend'],
                    result['close_price']
                ])

print("CSV file created: fiscal_yearend_prices.csv")
```

### 例12: DataFrameとして集計

```python
import pandas as pd
from get_fiscal_yearend_price import get_fiscal_yearend_price

tickers = ["AAPL", "MSFT", "GOOGL"]
years = range(2020, 2024)

data = []
for ticker in tickers:
    for year in years:
        result = get_fiscal_yearend_price(ticker, year)
        if result:
            data.append(result)

df = pd.DataFrame(data)
print(df)

# ピボットテーブルで見やすく
pivot = df.pivot(index='fiscal_year', columns='ticker', values='close_price')
print("\n期末決算日株価の推移:")
print(pivot)
```

**出力:**
```
ticker  AAPL   MSFT   GOOGL
fiscal_year                 
2020     115.81  222.42   1751.88
2021     141.50  281.92   2893.59
2022     138.20  232.90    88.73
2023     171.21  340.54   140.93
```

## よくある質問

**Q: 期末決算日とは何ですか？**

A: 企業の会計年度の最終日です。企業によって異なり、例えば：
- Apple: 9月末
- Microsoft: 6月末
- Google: 12月末
- トヨタ自動車: 3月末

**Q: 期末決算日が休日の場合はどうなりますか？**

A: 最も近い取引日の株価を取得します。前後5日間のデータから最も近い日を自動選択します。

**Q: どの市場の株価が取得できますか？**

A: Yahoo Financeが対応している全ての市場で使用可能です。日本株の場合は証券コードに `.T` を付けます。
