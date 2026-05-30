import { m } from '#/paraglide/messages'

type MessageFn = (args?: Record<string, unknown>) => string
type Messages = Record<string, MessageFn>

function humanize(key: string) {
  const last = key.split('.').pop() ?? key
  return last
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

export function useTranslations(_namespace?: string) {
  return (key: string, params?: Record<string, unknown>) => {
    const flat = key.replace(/\./g, '_')
    const fn = (m as unknown as Messages)[flat]
    return typeof fn === 'function' ? fn(params) : humanize(key)
  }
}
