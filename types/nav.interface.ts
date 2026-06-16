export interface NavItem {
    id?: string
    name?: string
    title: string
    translationKey: string
    icon?: React.ComponentType<{ className?: string }>
    href?: string
    children?: NavItem[]
}

export type Language = "en" | "vi"