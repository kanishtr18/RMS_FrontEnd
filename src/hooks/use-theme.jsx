// src/hooks/use-theme.js
import { useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "theme" // localStorage key

// helpers
const isSystemDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches

function applyThemeToDocument(theme) {
  if (typeof document === "undefined") return

  const root = document.documentElement

  if (theme === "dark") {
    root.classList.add("dark")
  } else if (theme === "light") {
    root.classList.remove("dark")
  } else {
    // theme === 'system' -> apply according to OS preference
    if (isSystemDark()) root.classList.add("dark")
    else root.classList.remove("dark")
  }
}

/**
 * useTheme hook
 *
 * Returns:
 *  - theme: "light" | "dark" | "system" (current preference stored in state)
 *  - setTheme(value): set preference & persist
 *  - resolvedTheme: "light" | "dark" (effective theme currently applied)
 *  - mounted: boolean (true after client mount; useful to avoid SSR mismatch)
 */
export function useTheme() {
  const [theme, setThemeState] = useState("system")
  const [mounted, setMounted] = useState(false)

  // On mount, read saved preference (if any) and apply
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === "light" || stored === "dark" || stored === "system") {
        setThemeState(stored)
        applyThemeToDocument(stored)
      } else {
        // default: system
        setThemeState("system")
        applyThemeToDocument("system")
      }
    } catch (e) {
      // localStorage might be blocked; fallback to system
      setThemeState("system")
      applyThemeToDocument("system")
    }

    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen to system theme changes when using "system"
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      // just apply the theme anyway
      applyThemeToDocument(theme)
      return
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)")

    function handleSystemChange(e) {
      // Only respond to system changes when theme === 'system'
      if (theme === "system") {
        applyThemeToDocument("system")
      }
    }

    // Always apply selected theme immediately
    applyThemeToDocument(theme)

    // Add listener only if theme === 'system'
    if (theme === "system" && typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handleSystemChange)
      return () => mq.removeEventListener("change", handleSystemChange)
    } else if (theme === "system" && typeof mq.addListener === "function") {
      // fallback for older browsers
      mq.addListener(handleSystemChange)
      return () => mq.removeListener(handleSystemChange)
    }
    // If theme is not 'system', ensure no listener is active (no cleanup needed here)
    return undefined
  }, [theme])

  // Setter wrapper — persists to localStorage and applies to document
  const setTheme = (value) => {
    if (!["light", "dark", "system"].includes(value)) {
      console.warn(`useTheme: invalid theme "${value}", ignoring.`)
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch (e) {
      // ignore storage errors (private mode, etc.)
    }

    setThemeState(value)
    applyThemeToDocument(value)
  }

  // resolvedTheme: the actual theme currently applied ("light" or "dark")
  const resolvedTheme = useMemo(() => {
    if (theme === "system") return isSystemDark() ? "dark" : "light"
    return theme
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, mounted])

  return { theme, setTheme, resolvedTheme, mounted }
}