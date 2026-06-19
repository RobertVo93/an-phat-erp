import Link from "next/link";
import React from "react"

interface CustomLinkProps {
  href: string;
  text?: string;
  children?: React.ReactNode;
}

export function CustomLink({
  href,
  text,
  children,
}: CustomLinkProps) {
  return (
    <Link 
        href={href} 
        className="text-sm font-medium text-emerald-700 underline-offset-4 hover:underline"
    >
        {children || text}
    </Link>
  )
}
