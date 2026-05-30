# Recipes (phutsakorn-ts)

Copy-ready, comment-free templates. Already match codebase. Adapt names, keep shape.

## Reusable UI primitive

`src/components/storybook/card.tsx`

```tsx
import { cn } from '#/lib/utils'

export interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border border-gray-200 p-4', className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-2 text-sm text-gray-700">{children}</div>
    </div>
  )
}
```

Add to barrel `src/components/storybook/index.ts`:

```ts
export { Card } from './card'
export type { CardProps } from './card'
```

## Story

`src/components/storybook/card.stories.tsx`

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card } from './card'

const meta = {
  title: 'Layout/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Card title',
    children: 'Card body content.',
  },
}
```

## Route

`src/routes/about.tsx` → serves `/about`

```tsx
import { createFileRoute } from '@tanstack/react-router'

import { m } from '#/paraglide/messages'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">{m.about_page()}</h1>
    </div>
  )
}
```

## i18n string

Add same key to both files.

`messages/en.json`

```json
{
  "about_page": "About"
}
```

`messages/th.json`

```json
{
  "about_page": "เกี่ยวกับเรา"
}
```

Use: `import { m } from '#/paraglide/messages'` then `m.about_page()`.
Interpolation: `m.current_locale({ locale })`.

## Form (SOLID: injected handler, narrow props, zod validation)

`src/components/settings-form.tsx`

```tsx
import { useState } from 'react'
import { z } from 'zod'

import { Button, Input } from '#/components/storybook'
import { m } from '#/paraglide/messages'

const schema = z.object({ name: z.string().min(1) })

export interface SettingsFormProps {
  initialName: string
  onSave: (name: string) => void
}

export function SettingsForm({ initialName, onSave }: SettingsFormProps) {
  const [name, setName] = useState(initialName)
  const result = schema.safeParse({ name })

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (result.success) onSave(result.data.name)
      }}
    >
      <Input id="name" label={m.name_label()} value={name} onChange={setName} />
      <Button type="submit" disabled={!result.success}>
        {m.save()}
      </Button>
    </form>
  )
}
```

`SettingsForm` never fetch or persist — route/mutation pass `onSave`.

## Test

`src/components/storybook/card.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { Card } from './card'

test('renders title and body', () => {
  render(<Card title="Hello">Body</Card>)
  expect(screen.getByText('Hello')).toBeDefined()
  expect(screen.getByText('Body')).toBeDefined()
})
```