"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export default function ClickableRow({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter();
  return (
    <tr
      onClick={() => router.push(href)}
      className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50"
    >
      {children}
    </tr>
  );
}
