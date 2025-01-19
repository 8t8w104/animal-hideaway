import Link from "next/link";

export const Header = () => {
  return (
    <>
      <header style={{ backgroundColor: 'lightblue' }}>
        <div>ヘッダー領域</div>
        <nav>
          <ol>
            <li>
              <Link href="/">
                Home
              </Link>
            </li>
            <li>
              <Link href="/testr1">
                Test1
              </Link>
            </li>
            <li>
              <Link href="/test3">
                Test2
              </Link>
            </li>
          </ol>
        </nav>
      </header>
    </>
  );
}
