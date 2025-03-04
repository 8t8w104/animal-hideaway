# 動物マッチングアプリ

## 概要
このアプリは、保護動物と里親をつなぐマッチングアプリです。


## 機能
### 一般ユーザー
* 保護動物を検索する
* 動物をお気に入り登録/解除する
* 里親希望する/解除する
### 職員ユーザー
* 保護動物を検索する
* 保護動物を登録する
* 里親決定する/解除する


## 使い方
### 一般ユーザー
1. アカウントを作成し、ログインします。
2. 保護動物を検索し、画像をクリックすることで詳細画面に遷移する。
3. 動物をお気に入り登録、または、応募する
### 職員ユーザー
1. アカウントを作成し、ログインします。
2. 保護動物を登録する。
3. 応募がある動物の里親を決定する。

## 技術スタック
* **フロントエンド:** Next.js
* **UIライブラリ:** Material UI
* **状態管理:** Zustand, React useState
* **API:** Next.js（API Routes）
* **データベース:** PostgreSQL (Supabase)
* **認証:** Supabase Auth
* **ファイルストレージ:** Supabase Storage
* **ORM:** Prisma
* **ホスティング:** Vercel
* **言語:** TypeScript
* **その他:** Prettier, Git

## 画面遷移図
https://miro.com/app/board/uXjVIWpTNyA=/

## シーケンス図
https://miro.com/app/board/uXjVIWqb2lk=/

## ER図
https://miro.com/app/board/uXjVIWoiAVY=/


## デモ
[URL]
https://animal-hideaway.vercel.app/

### 一般ユーザー１
ID:general1@test
PASS:general1

### 一般ユーザー２
ID:general2@test
PASS:general2

### 職員ユーザー１
ID:staff1@test
PASS:staff1

### 職員ユーザー２
ID:staff2@test
PASS:staff2
