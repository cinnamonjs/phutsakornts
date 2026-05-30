# SOLID in functional React (phutsakorn-ts)

SOLID written for OOP, but every principle map to real lever in React/TS
codebase. Read when component, hook, or module non-trivial. Point always same:
**make change cheap by keeping boundaries clean and dependencies pointing the
right way.** None mean write more code — see guardrail at bottom.

## S — Single Responsibility

Module should have one reason to change. In React usual smells: component that
fetches _and_ renders _and_ formats, or hook that owns three unrelated concerns.

**Before** — fetching, formatting, rendering all change this file:

```tsx
export function UserCard({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser)
  }, [userId])
  const initials = user
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
    : ''
  return (
    <div className="rounded-lg p-4">
      {initials} — {user?.name}
    </div>
  )
}
```

**After** — each piece changes for its own reason:

```tsx
export function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

export interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="rounded-lg p-4">
      {initials(user.name)} — {user.name}
    </div>
  )
}
```

Fetching now live in query/route loader; `initials` testable in `src/lib`;
`UserCard` only renders.

## O — Open/Closed

Add behavior without editing component. Two everyday tools: **composition**
(`children`/slots) and **cva variants**.

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils'

const badge = cva('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', {
  variants: {
    tone: {
      neutral: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

export interface BadgeProps
  extends VariantProps<typeof badge>, React.HTMLAttributes<HTMLSpanElement> {}

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />
}
```

New tone = new line in `variants` map, not rewrite of JSX.

## L — Liskov Substitution

Every variant must be usable through same contract. If `<Button variant="danger">`
suddenly required extra prop that `"primary"` didn't, callers couldn't swap
variants freely. Keep prop shape identical across variants; vary only the
_value_, never the _signature_.

## I — Interface Segregation

Narrow, specific `Props`. Anti-pattern: god-prop bag where most callers pass
`undefined`:

```tsx
interface FieldProps {
  label: string
  value?: string
  onChange?: (v: string) => void
  options?: Option[]
  min?: number
  max?: number
  checked?: boolean
  rows?: number
}
```

That one interface really text input, select, slider, checkbox fused together
— each caller uses quarter of it. Split into `TextField`, `Select`, `Slider`,
`Checkbox`, each with only props it needs. Smaller interfaces easier to read,
type, and not misuse.

## D — Dependency Inversion

Presentation depend on **abstractions injected from above** (props, context),
never on concrete data access it reaches for itself.

**Before** — form welded to specific client:

```tsx
import { db } from '#/lib/db'

export function SettingsForm() {
  const save = (name: string) => db.users.update({ name })
  // ...
}
```

**After** — form receives its dependency; caller (route/loader) wires the
concrete one:

```tsx
export interface SettingsFormProps {
  initialName: string
  onSave: (name: string) => void
}

export function SettingsForm({ initialName, onSave }: SettingsFormProps) {
  // renders, calls onSave — knows nothing about db
}
```

Now `SettingsForm` trivially testable and reusable; data dependency chosen at
edge. In this app "edge" usually route's loader or TanStack Query mutation
passed down.

## Guardrail: boundaries, not bureaucracy

Where strict SOLID meets "no premature abstraction" — both matter, resolve
cleanly if you remember what each for:

- SOLID decides **where the seam goes** (does fetching belong with rendering? is
  this prop bag really four components?).
- "Keep it minimal" decides **how much lives behind the seam**.

So: draw boundary, then implement smallest thing on each side.

- Do **not** create `interface` + implementation for single concrete use.
- Do **not** add DI indirection (factory, provider, strategy) for one-off.
- Do **not** shatter cohesive 10-line component into five files.
- **Do** split when real second caller, real second variant, or two genuinely
  different reasons to change.

Add seam when second case real, not anticipated.
