#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
期末決算日の株価取得スクリプト

このスクリプトはyfinanceライブラリを使用して、
指定した銘柄の期末決算日における株価を取得します。

使用例:
    python get_fiscal_yearend_price.py AAPL 2023
    python get_fiscal_yearend_price.py 7203.T 2023
"""

import sys
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta


def get_fiscal_yearend_price(ticker_symbol, year):
    """
    指定した銘柄の指定年における期末決算日の株価を取得
    
    このスクリプトはyfinanceライブラリを使用して、
    企業の会計年度末（期末決算日）における株価を取得します。
    
    Args:
        ticker_symbol (str): 銘柄コード (例: "AAPL", "7203.T")
        year (int): 取得したい年
    
    Returns:
        dict: 期末決算日と株価を含む辞書、またはNone
              {
                  'ticker': 銘柄コード,
                  'fiscal_year': 年,
                  'fiscal_yearend': 期末決算日,
                  'price_date': 株価取得日,
                  'close_price': 終値
              }
    """
    try:
        # Tickerオブジェクトを作成
        ticker = yf.Ticker(ticker_symbol)
        
        # 年次の財務諸表を取得（期末日付を特定するため）
        # income_stmtの列は期末決算日を表す
        income_stmt = ticker.get_income_stmt(freq="yearly")
        
        if income_stmt is None or income_stmt.empty:
            print(f"エラー: {ticker_symbol}の財務データが取得できませんでした")
            return None
        
        # 期末決算日を取得（列名が日付）
        fiscal_dates = income_stmt.columns
        
        # 指定された年の期末決算日を探す
        target_date = None
        for date in fiscal_dates:
            if date.year == year:
                target_date = date
                break
        
        if target_date is None:
            print(f"エラー: {year}年の期末決算日が見つかりませんでした")
            print(f"利用可能な期末決算日: {[d.strftime('%Y-%m-%d') for d in fiscal_dates[:5]]}")
            return None
        
        # 期末決算日の株価を取得
        # 期末日前後の数日間のデータを取得（休日対策）
        start_date = target_date - timedelta(days=5)
        end_date = target_date + timedelta(days=5)
        
        hist = ticker.history(start=start_date, end=end_date)
        
        if hist.empty:
            print(f"エラー: {target_date}前後の株価データが取得できませんでした")
            return None
        
        # 期末決算日に最も近い日の株価を取得
        closest_date = min(hist.index, key=lambda d: abs((d.date() if hasattr(d, 'date') else d) - target_date.date()))
        stock_price = hist.loc[closest_date, 'Close']
        
        result = {
            'ticker': ticker_symbol,
            'fiscal_year': year,
            'fiscal_yearend': target_date.strftime('%Y-%m-%d'),
            'price_date': closest_date.strftime('%Y-%m-%d') if hasattr(closest_date, 'strftime') else str(closest_date),
            'close_price': round(float(stock_price), 2)
        }
        
        return result
        
    except Exception as e:
        print(f"エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()
        return None


def main():
    """メイン関数"""
    if len(sys.argv) < 3:
        print("使用方法: python get_fiscal_yearend_price.py <銘柄コード> <年>")
        print("例: python get_fiscal_yearend_price.py AAPL 2023")
        print("例: python get_fiscal_yearend_price.py 7203.T 2023")
        sys.exit(1)
    
    ticker_symbol = sys.argv[1]
    
    try:
        year = int(sys.argv[2])
    except ValueError:
        print(f"エラー: 年は数値で指定してください: {sys.argv[2]}")
        sys.exit(1)
    
    print(f"\n{ticker_symbol} の {year}年 期末決算日の株価を取得中...\n")
    
    result = get_fiscal_yearend_price(ticker_symbol, year)
    
    if result:
        print("=" * 50)
        print(f"銘柄コード: {result['ticker']}")
        print(f"期末決算日: {result['fiscal_yearend']}")
        print(f"株価取得日: {result['price_date']}")
        print(f"終値: {result['close_price']}")
        print("=" * 50)
        return 0
    else:
        return 1


if __name__ == "__main__":
    sys.exit(main())
