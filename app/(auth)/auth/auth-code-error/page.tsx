'use client'

export default function AuthCodeError() {
  return (
    <div>
      <h1>認証エラーが発生しました</h1>
      <p>{'予期しないエラーが発生しました。再度お試しください。'}</p>
      <a href="/login">ログイン画面に戻る</a>
    </div>
  )
}
