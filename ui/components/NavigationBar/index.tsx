"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export type NavigationItem = {
    label: string
    url: string
    icon: ReactNode
}

type NavigationBarProps = {
    pages: NavigationItem[]
}

export function NavigationBar({
    pages
}: NavigationBarProps) {

    const pathname = usePathname();

    

    return(
        <nav className="h-full flex items-end gap-2">
            {
                pages.map((p) => (
                    <Link key={p.url} 
                    className={`
                        ${pathname == p.url ? "text-primary border-b-2 border-primary font-semibold" : "text-muted-foreground"}
                        flex items-center gap-1 h-4/5 px-4 transition-all duration-100`}
                    href={p.url}>
                        {p.icon}
                        {p.label}
                    </Link>
                ))
            }
        </nav>
    )
}