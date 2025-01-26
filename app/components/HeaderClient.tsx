'use client'
import Link from "next/link";
import { signOutAction } from "../actions";
import { User } from "@supabase/supabase-js";
import { Auth } from "./Auth";
import { createSupabaseClient } from "@/utils/supabase/client";
import { useEffect } from "react";

const navItems = [
  { href: "/login/organization", label: "団体のログイン画面" },
  { href: "/login/personal", label: "個人のログイン画面" },
  { href: "/regist", label: "動物を登録する" },
  { href: "/animals", label: "動物を検索する" },
  { href: "/contact", label: "運営に問い合わせる" },
];

export const HeaderClient = ({ user }: { user: User | null }) => {
  console.log(user);
  console.log("HeaderClient user");

  useEffect(() => {
    const getSession = async () => {
      const supabaseClient = await createSupabaseClient();
      const session = await supabaseClient.auth.getSession()
      console.log(session);
      console.log("↑supabaseClient.auth.getSession()");
    }
    getSession()
  })


  const handleSignOutClick = () => {
    signOutAction()
  };
  return (
    <>
      <header style={{ backgroundColor: 'lightblue' }}>
        <div>ヘッダー領域</div>
        <nav>
          <ol>
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}

            {user &&
              <li>
                <Link href="#" onClick={(e) => {
                  e.preventDefault();
                  handleSignOutClick();
                }}>
                  Sign out
                </Link>
              </li>
            }
          </ol>
          <Auth />
        </nav>
      </header>
    </>
  );
}
