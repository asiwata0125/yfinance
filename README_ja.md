# yfinance - Yahoo! Finance APIからの市場データ取得

<img src="./doc/yfinance-gh-logo-dark.webp#gh-dark-mode-only" height="100">
<img src="./doc/yfinance-gh-logo-light.webp#gh-light-mode-only" height="100">

**yfinance** は、[Yahoo!Ⓡ finance](https://finance.yahoo.com)から金融・市場データを取得するためのPythonライブラリです。

---

> [!IMPORTANT]  
> **Yahoo!、Y!Finance、Yahoo! financeは、Yahoo, Inc.の登録商標です。**
>
> yfinanceは、Yahoo, Inc.によって提携、承認、または検証されていません。Yahoo社が公開しているAPIを使用するオープンソースツールであり、研究および教育目的で使用することを目的としています。
> 
> **ダウンロードした実際のデータを使用する権利の詳細については、Yahoo!の利用規約を参照してください** ([こちら](https://policies.yahoo.com/us/en/yahoo/terms/product-atos/apiforydn/index.htm)、[こちら](https://legal.yahoo.com/us/en/yahoo/terms/otos/index.html)、[こちら](https://policies.yahoo.com/us/en/yahoo/terms/index.htm))。
>
> 注意 - Yahoo! finance APIは個人使用のみを目的としています。

---

## このAPIでできること

yfinanceを使用すると、以下のような豊富な金融データを簡単に取得できます：

### 主要機能

1. **単一銘柄のデータ取得 (`Ticker`)**
   - 株式、ETF、投資信託、暗号通貨など、個別銘柄の詳細データを取得

2. **複数銘柄のデータ取得 (`Tickers`, `download`)**
   - 複数の銘柄データを一括で効率的に取得

3. **市場情報 (`Market`)**
   - 市場全体のサマリー情報を取得

4. **リアルタイムデータ配信 (`WebSocket`, `AsyncWebSocket`)**
   - リアルタイムで市場データをストリーミング

5. **検索機能 (`Search`, `Lookup`)**
   - 銘柄の検索、ニュース検索

6. **セクター・業種情報 (`Sector`, `Industry`)**
   - セクターおよび業種別の情報を取得

7. **スクリーニング機能 (`EquityQuery`, `FundQuery`, `screen`)**
   - カスタム条件で市場をスクリーニング

---

## 取得できる情報

### 1. 株価・価格データ

- **過去の株価データ (`history`)**
  - 始値、高値、安値、終値、出来高
  - 調整後株価
  - 配当落ち調整
  - 株式分割調整

- **リアルタイム価格情報 (`fast_info`)**
  - 現在の株価
  - 前日終値
  - 日中高値/安値
  - 52週高値/安値
  - 時価総額

### 2. 企業基本情報 (`info`)

- 企業名、セクター、業種
- 本社所在地
- ウェブサイトURL
- 事業概要
- フルタイム従業員数
- ISINコード

### 3. 財務諸表データ

- **損益計算書 (`income_stmt`, `quarterly_income_stmt`)**
  - 売上高
  - 営業利益
  - 純利益
  - EPS（1株当たり利益）
  - 四半期ごとおよび年次データ

- **貸借対照表 (`balance_sheet`, `quarterly_balance_sheet`)**
  - 総資産
  - 総負債
  - 株主資本
  - 流動資産/負債
  - 四半期ごとおよび年次データ

- **キャッシュフロー計算書 (`cashflow`, `quarterly_cashflow`)**
  - 営業キャッシュフロー
  - 投資キャッシュフロー
  - 財務キャッシュフロー
  - フリーキャッシュフロー

### 4. 配当・株式分割データ

- **配当金 (`dividends`)**
  - 配当金の履歴
  - 配当利回り
  - 配当性向

- **株式分割 (`splits`)**
  - 株式分割の履歴と比率

- **コーポレートアクション (`actions`)**
  - 配当と株式分割の統合データ

### 5. アナリスト情報・予測

- **アナリストの推奨 (`recommendations`)**
  - 買い/売り/保有の推奨
  - アナリストの格付け履歴

- **推奨サマリー (`recommendations_summary`)**
  - 推奨の集計データ

- **格上げ/格下げ (`upgrades_downgrades`)**
  - アナリストによる格付け変更履歴

- **目標株価 (`analyst_price_targets`)**
  - アナリストの目標株価
  - 高値/安値/平均予想

- **業績予想 (`earnings_estimate`)**
  - EPSの予想
  - 売上高の予想

- **売上予想 (`revenue_estimate`)**
  - 四半期・年次売上予想

### 6. 決算・カレンダー情報

- **決算カレンダー (`calendar`)**
  - 次回決算発表日
  - 配当落ち日
  - 配当支払日

- **決算日程 (`earnings_dates`)**
  - 過去および今後の決算発表日

- **決算履歴 (`earnings_history`)**
  - 実績EPSと予想EPSの比較

### 7. 保有者情報

- **大株主 (`major_holders`)**
  - 主要株主の保有比率
  - インサイダー保有率
  - 機関投資家保有率

- **機関投資家保有 (`institutional_holders`)**
  - 機関投資家の詳細な保有情報
  - 保有株数と変動

- **投資信託保有 (`mutualfund_holders`)**
  - 投資信託の保有情報

- **インサイダー取引 (`insider_transactions`)**
  - 役員・インサイダーの売買履歴

- **インサイダー購入 (`insider_purchases`)**
  - インサイダーによる購入情報

- **インサイダー名簿 (`insider_roster_holders`)**
  - インサイダーの保有状況

### 8. オプション取引データ

- **オプションチェーン (`option_chain`)**
  - コールオプション
  - プットオプション
  - 権利行使価格
  - 満期日
  - インプライドボラティリティ

- **オプション満期日 (`options`)**
  - 利用可能なオプション満期日のリスト

### 9. 投資信託・ETF情報

- **ファンドデータ (`funds_data`)**
  - ファンドの説明
  - 上位保有銘柄
  - セクター配分
  - 運用会社情報
  - パフォーマンス統計
  - リスク統計

### 10. ESG・サステナビリティ

- **サステナビリティスコア (`sustainability`)**
  - 環境スコア
  - 社会スコア
  - ガバナンススコア
  - ESG総合スコア

### 11. ニュース・SEC提出書類

- **ニュース (`news`)**
  - 企業関連ニュース
  - タイトル、リンク、公開日

- **SEC提出書類 (`sec_filings`)**
  - 10-K、10-Q、8-Kなどの提出書類
  - 提出日とリンク

### 12. 市場・セクター・業種データ

- **市場サマリー (`Market`)**
  - 主要指数の情報
  - 市場全体の動向

- **セクター情報 (`Sector`)**
  - セクター別パフォーマンス
  - セクター内の銘柄一覧

- **業種情報 (`Industry`)**
  - 業種別パフォーマンス
  - 業種内の銘柄一覧

### 13. 成長性指標

- **成長予想 (`growth_estimates`)**
  - 今後の成長率予想
  - EPSの成長予想
  - 売上成長予想

- **EPSトレンド (`eps_trend`)**
  - EPSの推移と予想の変化

- **EPSリビジョン (`eps_revisions`)**
  - アナリストによるEPS予想の修正

### 14. 株式発行数

- **株式総数 (`shares`)**
  - 発行済み株式数の履歴
  - 株式数の変動

---

## インストール

PYPIから`pip`を使用してインストール：

```bash
$ pip install yfinance
```

---

## 使用例

### 単一銘柄のデータ取得

```python
import yfinance as yf

# Tickerオブジェクトの作成
msft = yf.Ticker("MSFT")

# 企業情報の取得
print(msft.info)

# 過去1ヶ月の株価データを取得
hist = msft.history(period="1mo")
print(hist)

# 財務諸表の取得
print(msft.quarterly_income_stmt)  # 四半期損益計算書
print(msft.balance_sheet)  # 貸借対照表
print(msft.cashflow)  # キャッシュフロー計算書

# 配当金と株式分割の履歴
print(msft.dividends)
print(msft.splits)

# アナリストの推奨と目標株価
print(msft.recommendations)
print(msft.analyst_price_targets)

# 決算カレンダー
print(msft.calendar)

# オプションデータ
options = msft.option_chain(msft.options[0])
print(options.calls)  # コールオプション
print(options.puts)   # プットオプション
```

### 複数銘柄のデータ一括取得

```python
import yfinance as yf

# 複数銘柄の株価データをダウンロード
data = yf.download("AAPL MSFT GOOG", period="1mo")
print(data)

# Tickersオブジェクトで複数銘柄を管理
tickers = yf.Tickers('MSFT AAPL GOOG')
print(tickers.tickers['MSFT'].info)
print(tickers.tickers['AAPL'].history(period='1mo'))
```

### 投資信託・ETFのデータ取得

```python
import yfinance as yf

# ETFのデータ取得
spy = yf.Ticker('SPY')

# ファンド情報
funds_data = spy.funds_data
print(funds_data.description)      # ファンドの説明
print(funds_data.top_holdings)     # 上位保有銘柄
print(funds_data.sector_weightings) # セクター配分
```

### リアルタイムデータのストリーミング

```python
import yfinance as yf

# 同期的にリアルタイムデータを取得
ticker = yf.Ticker("AAPL")
with ticker.live() as ws:
    for message in ws:
        print(message)

# 非同期でリアルタイムデータを取得
import asyncio

async def stream_data():
    ticker = yf.Ticker("AAPL")
    async with ticker.live_async() as ws:
        async for message in ws:
            print(message)

asyncio.run(stream_data())
```

### 市場のスクリーニング

```python
import yfinance as yf

# 株式のクエリを構築
query = yf.EquityQuery('gt', ['eodvolume', 5000000])  # 出来高が500万以上

# スクリーニングを実行
results = yf.screen(query)
print(results)
```

### セクター・業種情報の取得

```python
import yfinance as yf

# テクノロジーセクターの情報
tech_sector = yf.Sector('technology')
print(tech_sector.overview)
print(tech_sector.top_companies)

# ソフトウェア業種の情報
software_industry = yf.Industry('software-application')
print(software_industry.overview)
print(software_industry.top_companies)
```

### 銘柄の検索

```python
import yfinance as yf

# 銘柄の検索
search = yf.Search('Apple', news_count=5, enable_fuzzy_query=False)
print(search.quotes)  # 検索結果の銘柄リスト
print(search.news)    # 関連ニュース

# ティッカーシンボルの検索
lookup = yf.Lookup('AAPL')
print(lookup.all)
```

---

## 取得データの期間指定

`history()`メソッドでは、以下の期間指定が可能です：

- `period`: `"1d"`, `"5d"`, `"1mo"`, `"3mo"`, `"6mo"`, `"1y"`, `"2y"`, `"5y"`, `"10y"`, `"ytd"`, `"max"`
- `interval`: `"1m"`, `"2m"`, `"5m"`, `"15m"`, `"30m"`, `"60m"`, `"90m"`, `"1h"`, `"1d"`, `"5d"`, `"1wk"`, `"1mo"`, `"3mo"`

```python
import yfinance as yf

ticker = yf.Ticker("AAPL")

# 過去1年間の日次データ
hist = ticker.history(period="1y", interval="1d")

# 過去5日間の1分足データ
hist_1m = ticker.history(period="5d", interval="1m")

# カスタム期間の指定
hist_custom = ticker.history(start="2020-01-01", end="2023-12-31")
```

---

## プロキシの使用

```python
import yfinance as yf

# プロキシサーバーの設定
yf.set_config(proxies={'http': 'http://proxy.example.com:8080'})

# その後の全ての通信でプロキシが使用されます
ticker = yf.Ticker("AAPL")
data = ticker.history(period="1mo")
```

---

## デバッグモードの有効化

```python
import yfinance as yf

# デバッグモードを有効化
yf.enable_debug_mode()

# これにより、詳細なログが出力されます
ticker = yf.Ticker("AAPL")
data = ticker.history(period="1mo")
```

---

## 詳細なドキュメント

完全なAPIドキュメントは以下をご覧ください：
- 公式ドキュメントサイト: [ranaroussi.github.io/yfinance](https://ranaroussi.github.io/yfinance)
- English README: [README.md](./README.md)

---

## コントリビューション

yfinanceはコミュニティによるバグ調査とコード貢献に依存しています。貢献方法については[CONTRIBUTING.md](CONTRIBUTING.md)をご覧ください。

---

## ライセンス

**yfinance**は**Apache Software License**の下で配布されています。詳細は[LICENSE.txt](./LICENSE.txt)ファイルをご覧ください。

繰り返しになりますが、yfinanceはYahoo, Inc.によって提携、承認、または検証されていません。Yahoo社が公開しているAPIを使用するオープンソースツールであり、研究および教育目的で使用することを目的としています。

---

## 注意事項

このライブラリは無料で提供されていますが、Yahoo! FinanceのAPIの利用規約に従う必要があります。商用利用や大量のデータ取得を行う場合は、Yahoo!の利用規約を必ず確認してください。

APIのレート制限により、短時間に大量のリクエストを送信すると一時的にブロックされる可能性があります。適切な間隔を空けてリクエストを送信することを推奨します。

---

**作者: Ran Aroussi**
