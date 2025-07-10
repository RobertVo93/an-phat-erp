"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { navTranslations } from "@/locales/nav"
import { authTranslations } from "@/locales/auth"
import { dashboardTranslations } from "@/locales/dashboard"
import { headerTranslations } from "@/locales/header"
import { productsTranslations } from "@/locales/products"
import { ordersTranslations } from "@/locales/orders"
import { collectionsTranslations } from "@/locales/collections"
import { customersTranslations } from "@/locales/customers"
import { employeesTranslations } from "@/locales/employees"
import { attendanceTranslations } from "@/locales/attendance"
import { utilitiesTranslations } from "@/locales/utilities"
import { invoicesTranslations } from "@/locales/invoices"
import { payrollTranslations } from "@/locales/payroll"
import { warehouseTranslations } from "@/locales/warehouse"
import { stockInTranslations } from "@/locales/stock-in"
import { commonTranslations } from "@/locales/common"
import { productionTranslations } from "@/locales/production"


type Language = "en" | "vi"

export interface Translations {
  [key: string]: {
    en: string
    vi: string
  }
}

const translations: Translations = {
  ...navTranslations,
  ...authTranslations,
  ...dashboardTranslations,
  ...headerTranslations,
  ...productsTranslations,
  ...ordersTranslations,
  ...collectionsTranslations,
  ...customersTranslations,
  ...employeesTranslations,
  ...attendanceTranslations,
  ...utilitiesTranslations,
  ...invoicesTranslations,
  ...payrollTranslations,
  ...warehouseTranslations,
  ...stockInTranslations,
  ...commonTranslations,
  ...productionTranslations
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language]
    }
    return key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
