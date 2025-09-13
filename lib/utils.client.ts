"use client"

import { useEffect, useState } from "react"

export function useDebounceSearchTerm<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debounced
}

export { withApiBase } from "@/lib/base-path"