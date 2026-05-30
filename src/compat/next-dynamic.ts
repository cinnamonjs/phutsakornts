import { type ComponentType, lazy } from 'react'

type Loader<P> = () => Promise<{ default: ComponentType<P> } | ComponentType<P>>

export default function dynamic<P extends object>(
  loader: Loader<P>,
  _options?: { ssr?: boolean; loading?: ComponentType },
): ComponentType<P> {
  return lazy(async () => {
    const mod = await loader()
    const resolved =
      'default' in mod ? mod.default : (mod as ComponentType<P>)
    return { default: resolved }
  }) as ComponentType<P>
}
