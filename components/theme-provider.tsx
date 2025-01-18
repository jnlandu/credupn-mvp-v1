"use client"


import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// import type { ThemeProviderProps as NextThemeProviderProps } from "next-themes/dist/types"
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

// export interface ThemeProviderProps {
//   children: React.ReactNode
//   attribute?: "class" | "data-theme" | "data-mode"
//   defaultTheme?: string
//   enableSystem?: boolean
//   disableTransitionOnChange?: boolean
// }

// export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
//   return (
//     <NextThemesProvider {...props}>
//       {children}
//     </NextThemesProvider>
//   )
// }

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}