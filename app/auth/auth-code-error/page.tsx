'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCodeError() {
  // const router = useRouter()
  // const { message } = router.
  const searchParams = useSearchParams();
  console.log(searchParams)
  console.log("↑searchParams")

  return (
    <div>
      <h1>認証エラーが発生しました</h1>
      <p>{'予期しないエラーが発生しました。再度お試しください。'}</p>
      <a href="/login">ログイン画面に戻る</a>
    </div>
  )
}
