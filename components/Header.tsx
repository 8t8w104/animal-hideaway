import Link from "next/link";

export const Header = () => {
  return (
    <>
      <header style={{ backgroundColor: 'lightblue' }}>
        <div>ヘッダー領域</div>
        <nav>
          <ol>
            <li>
              <Link href="/login/organization">
                団体のログイン画面
              </Link>
            </li>
            <li>
              <Link href="/login/personal">
                個人のログイン画面
              </Link>
            </li>
            <li>
              <Link href="/regist">
                動物を登録する
              </Link>
            </li>
            <li>
              <Link href="/animals">
                動物を検索する
              </Link>
            </li>
            <li>
              <Link href="/contact">
                運営に問い合わせる
              </Link>
            </li>
          </ol>
        </nav>
      </header>
    </>
  );
}
