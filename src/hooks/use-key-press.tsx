import { useEffect, useMemo } from "react"

type ModifierKey = "ctrl" | "shift" | "alt" | "meta"
type Shortcut =
  | string
  | `${ModifierKey}+${string}`
  | `${ModifierKey}+${ModifierKey}+${string}`

type ShortcutMap = Record<Shortcut, () => void>

export function useKeyPress(shortcuts: ShortcutMap) {
  const entries = useMemo(
    () =>
      Object.entries(shortcuts).map(([shortcut, callback]) => ({
        parts: shortcut.toLowerCase().split("+"),
        callback,
      })),
    [shortcuts]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const { parts, callback } of entries) {
        const key = parts.at(-1)
        const modifiers = parts.slice(0, -1)

        const match =
          modifiers.every((mod) => {
            switch (mod) {
              case "ctrl":
                return e.ctrlKey
              case "shift":
                return e.shiftKey
              case "alt":
                return e.altKey
              case "meta":
                return e.metaKey
              default:
                return false
            }
          }) &&
          e.key.toLowerCase() === key

        if (match) {
          e.preventDefault()
          callback()
          break
        }
      }
    }

    window.addEventListener("keydown", handler)

    return () => {
      window.removeEventListener("keydown", handler)
    }
  }, [entries])
}
