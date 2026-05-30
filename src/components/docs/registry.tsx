import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Button,
  Dialog,
  Input,
  Picker,
  RadioGroup,
  Slider,
  Tag,
} from '@phutsakorn/ui'

import buttonSrc from '../../../packages/ui/src/components/button.tsx?raw'
import dialogSrc from '../../../packages/ui/src/components/dialog.tsx?raw'
import inputSrc from '../../../packages/ui/src/components/input.tsx?raw'
import pickerSrc from '../../../packages/ui/src/components/picker.tsx?raw'
import radioGroupSrc from '../../../packages/ui/src/components/radio-group.tsx?raw'
import sliderSrc from '../../../packages/ui/src/components/slider.tsx?raw'
import tagSrc from '../../../packages/ui/src/components/tag.tsx?raw'
import activityTreeSrc from '../../../packages/core/activity-tree/index.ts?raw'
import dataViewSrc from '../../../packages/core/data-view/index.ts?raw'
import detailBuilderSrc from '../../../packages/core/detail-builder/index.ts?raw'
import formBuilderSrc from '../../../packages/core/form-builder/index.ts?raw'
import listViewSrc from '../../../packages/core/list-view/index.ts?raw'
import modalSrc from '../../../packages/core/modal/index.ts?raw'
import pageBuilderSrc from '../../../packages/core/page-builder/index.ts?raw'
import timelineSectionSrc from '../../../packages/core/timeline-section/index.ts?raw'

import {
  DetailBuilderDemo,
  FormBuilderDemo,
  ListViewDemo,
  ModalDemo,
  TimelineSectionDemo,
  contactFormJson,
} from './core-demos'

import { m } from '#/paraglide/messages'

export const categories = ['builder', 'factory', 'lib', 'core'] as const

export type DocsCategory = (typeof categories)[number]

export interface DocsVariant {
  name: string
  node: ReactNode
  code?: string
  codeFile?: string
}

export interface DocsSource {
  file: string
  code: string
}

export interface DocsEntry {
  slug: string
  name: string
  category: DocsCategory
  description: () => string
  install: string
  usage: string
  sources: DocsSource[]
  variants?: DocsVariant[]
  dependencies?: string[]
}

const categoryLabels: Record<DocsCategory, () => string> = {
  builder: m.docs_cat_builder,
  factory: m.docs_cat_factory,
  lib: m.docs_cat_lib,
  core: m.docs_cat_core,
}

export function categoryLabel(category: DocsCategory) {
  return categoryLabels[category]
}

const UI_INSTALL = 'bun add @phutsakorn/ui'

function PickerDemo() {
  const [value, setValue] = useState('day')
  return (
    <Picker
      value={value}
      onChange={setValue}
      options={[
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
      ]}
    />
  )
}

function RadioGroupDemo() {
  const [value, setValue] = useState('full-time')
  return (
    <RadioGroup
      label="Employment Type"
      name="employment"
      value={value}
      onChange={setValue}
      options={[
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
      ]}
    />
  )
}

function InputDemo() {
  const [value, setValue] = useState('')
  return (
    <Input
      id="demo-email"
      label="Email Address"
      placeholder="you@example.com"
      value={value}
      onChange={setValue}
    />
  )
}

function SliderDemo() {
  const [value, setValue] = useState(50)
  return (
    <Slider id="demo-volume" label="Volume" value={value} onChange={setValue} />
  )
}

export const docsRegistry: DocsEntry[] = [
  {
    slug: 'picker',
    name: 'Picker',
    category: 'builder',
    description: m.docs_desc_picker,
    install: UI_INSTALL,
    usage: `import { Picker } from '@phutsakorn/ui'

<Picker
  value={value}
  onChange={setValue}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
/>`,
    sources: [{ file: 'picker.tsx', code: pickerSrc }],
    variants: [{ name: 'Segmented', node: <PickerDemo /> }],
  },
  {
    slug: 'radio-group',
    name: 'Radio Group',
    category: 'builder',
    description: m.docs_desc_radio_group,
    install: UI_INSTALL,
    usage: `import { RadioGroup } from '@phutsakorn/ui'

<RadioGroup
  label="Employment Type"
  name="employment"
  value={value}
  onChange={setValue}
  options={[
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
  ]}
/>`,
    sources: [{ file: 'radio-group.tsx', code: radioGroupSrc }],
    variants: [{ name: 'Single choice', node: <RadioGroupDemo /> }],
  },
  {
    slug: 'button',
    name: 'Button',
    category: 'factory',
    description: m.docs_desc_button,
    install: UI_INSTALL,
    usage: `import { Button } from '@phutsakorn/ui'

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger" size="small">Delete</Button>`,
    sources: [{ file: 'button.tsx', code: buttonSrc }],
    variants: [
      { name: 'Primary', node: <Button variant="primary">Primary</Button> },
      {
        name: 'Secondary',
        node: <Button variant="secondary">Secondary</Button>,
      },
      { name: 'Danger', node: <Button variant="danger">Delete</Button> },
      {
        name: 'Sizes',
        node: (
          <div className="flex items-center gap-3">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </div>
        ),
      },
    ],
  },
  {
    slug: 'tag',
    name: 'Tag',
    category: 'factory',
    description: m.docs_desc_tag,
    install: UI_INSTALL,
    usage: `import { Tag } from '@phutsakorn/ui'

<Tag variant="soft">Draft</Tag>
<Tag variant="solid">Published</Tag>
<Tag variant="outline">Archived</Tag>`,
    sources: [{ file: 'tag.tsx', code: tagSrc }],
    variants: [
      { name: 'Soft', node: <Tag variant="soft">Draft</Tag> },
      { name: 'Solid', node: <Tag variant="solid">Published</Tag> },
      { name: 'Outline', node: <Tag variant="outline">Archived</Tag> },
    ],
  },
  {
    slug: 'input',
    name: 'Input',
    category: 'lib',
    description: m.docs_desc_input,
    install: UI_INSTALL,
    usage: `import { Input } from '@phutsakorn/ui'

<Input
  id="email"
  label="Email Address"
  placeholder="you@example.com"
  value={value}
  onChange={setValue}
/>`,
    sources: [{ file: 'input.tsx', code: inputSrc }],
    variants: [{ name: 'Default', node: <InputDemo /> }],
  },
  {
    slug: 'slider',
    name: 'Slider',
    category: 'lib',
    description: m.docs_desc_slider,
    install: UI_INSTALL,
    usage: `import { Slider } from '@phutsakorn/ui'

<Slider id="volume" label="Volume" value={value} onChange={setValue} />`,
    sources: [{ file: 'slider.tsx', code: sliderSrc }],
    variants: [{ name: 'Default', node: <SliderDemo /> }],
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    category: 'lib',
    description: m.docs_desc_dialog,
    install: UI_INSTALL,
    usage: `import { Button, Dialog } from '@phutsakorn/ui'

<Dialog
  title="Confirm Action"
  footer={<Button variant="primary">Confirm</Button>}
>
  <p>Are you sure you want to proceed?</p>
</Dialog>`,
    sources: [{ file: 'dialog.tsx', code: dialogSrc }],
    variants: [
      {
        name: 'With footer',
        node: (
          <Dialog
            title="Confirm Action"
            className="w-80"
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Confirm</Button>
              </div>
            }
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to proceed?
            </p>
          </Dialog>
        ),
      },
    ],
  },
  {
    slug: 'form-builder',
    name: 'Form Builder',
    category: 'core',
    description: m.docs_desc_form_builder,
    install: 'bun add react-hook-form @hookform/resolvers zod sonner',
    usage: `import { FormBuilder } from '@/components/module/form-builder'`,
    sources: [
      { file: 'packages/core/form-builder/index.ts', code: formBuilderSrc },
    ],
    variants: [
      {
        name: 'Contact form',
        node: <FormBuilderDemo />,
        code: contactFormJson,
        codeFile: 'contact-form.json',
      },
    ],
    dependencies: [
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'sonner',
      '@hugeicons/react',
      '@/components/ui/*',
      '@/components/date/presetpicker',
      '@/service/file.service',
    ],
  },
  {
    slug: 'data-view',
    name: 'Data View',
    category: 'core',
    description: m.docs_desc_data_view,
    install: 'bun add @tanstack/react-table @tanstack/react-query',
    usage: `import { DataViewModule } from '@/components/module/data-view'`,
    sources: [{ file: 'packages/core/data-view/index.ts', code: dataViewSrc }],
    dependencies: [
      '@tanstack/react-table',
      '@tanstack/react-query',
      '@/components/ui/*',
      '@/lib/cursor-wrapper',
      '@/components/composite/date-range-scroll-picker',
    ],
  },
  {
    slug: 'page-builder',
    name: 'Page Builder',
    category: 'core',
    description: m.docs_desc_page_builder,
    install: 'bun add @tanstack/react-query',
    usage: `import { PageLayout } from '@/components/module/page-builder'`,
    sources: [
      { file: 'packages/core/page-builder/index.ts', code: pageBuilderSrc },
    ],
    dependencies: [
      '@tanstack/react-query',
      '@/components/ui/*',
      '@/lib/cursor-wrapper',
      '@/components/module/data-view',
      '@/components/module/modal',
    ],
  },
  {
    slug: 'detail-builder',
    name: 'Detail Builder',
    category: 'core',
    description: m.docs_desc_detail_builder,
    install: 'bun add @tanstack/react-query',
    usage: `import { DetailLayout } from '@/components/module/detail-builder'`,
    sources: [
      { file: 'packages/core/detail-builder/index.ts', code: detailBuilderSrc },
    ],
    variants: [
      {
        name: 'Invoice detail',
        node: <DetailBuilderDemo />,
        codeFile: 'invoice-detail.ts',
        code: `const config = createDetail<Invoice>()
  .withQueryKey((id) => ['invoice', id])
  .withFetch((id) => fetchInvoice(id))
  .withHeader({
    title: (d) => d.customer,
    subtitle: (d) => d.email,
  })
  .withSections([
    fieldsSection('overview', 'Overview', [
      field('Customer', 'customer'),
      field('Email', 'email'),
      field('Status', 'status'),
      field('Amount', 'amount'),
    ]),
  ])
  .build()

<DetailLayout id="inv_1024" config={config} />`,
      },
    ],
    dependencies: [
      '@tanstack/react-query',
      '@/components/ui/*',
      '@/components/module/data-view',
      '@/components/module/modal',
    ],
  },
  {
    slug: 'modal',
    name: 'Modal',
    category: 'core',
    description: m.docs_desc_modal,
    install: 'bun add framer-motion zustand zod',
    usage: `import { ModalShell } from '@/components/module/modal'`,
    sources: [{ file: 'packages/core/modal/index.ts', code: modalSrc }],
    variants: [
      {
        name: 'CTA trigger',
        node: <ModalDemo />,
        codeFile: 'cta.tsx',
        code: `<CTAButton
  config={{
    label: 'New invoice',
    onClick: () => openInvoiceModal(),
  }}
/>`,
      },
    ],
    dependencies: [
      'framer-motion',
      'zustand',
      'zod',
      '@/components/ui/*',
      '@/hooks/use-media-query',
      '@/components/module/form-builder',
    ],
  },
  {
    slug: 'activity-tree',
    name: 'Activity Tree',
    category: 'core',
    description: m.docs_desc_activity_tree,
    install: 'bun add @xyflow/react dagre nanoid zustand @tanstack/react-query',
    usage: `import { ActivityTree } from '@/components/module/activity-tree'`,
    sources: [
      { file: 'packages/core/activity-tree/index.ts', code: activityTreeSrc },
    ],
    dependencies: [
      '@xyflow/react',
      'dagre',
      'nanoid',
      'zustand',
      '@tanstack/react-query',
      '@/components/ui/*',
      '@/service/balance.service',
      '@/service/customer.service',
    ],
  },
  {
    slug: 'list-view',
    name: 'List View',
    category: 'core',
    description: m.docs_desc_list_view,
    install: 'bun add lucide-react clsx tailwind-merge',
    usage: `import { ListView } from '@/components/module/list-view'`,
    sources: [{ file: 'packages/core/list-view/index.ts', code: listViewSrc }],
    variants: [
      {
        name: 'Cards',
        node: <ListViewDemo />,
        codeFile: 'documents.tsx',
        code: `<ListView<Doc>
  title="Documents"
  emptyMessage="No documents yet"
  query={{
    data: { pages: [{ data: docs, has_more: false }] },
    isLoading: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: async () => undefined,
  }}
  renderCard={(items) => items.map((d) => <Card key={d.id} {...d} />)}
  renderList={(items) => items.map((d) => <Row key={d.id} {...d} />)}
/>`,
      },
    ],
    dependencies: [
      '@/components/ui/button',
      '@/components/ui/dialog',
      '@/components/ui/skeleton',
      '@/lib/utils',
    ],
  },
  {
    slug: 'timeline-section',
    name: 'Timeline Section',
    category: 'core',
    description: m.docs_desc_timeline_section,
    install: 'bun add clsx tailwind-merge',
    usage: `import { TimelineSection } from '@/components/module/timeline-section'`,
    sources: [
      {
        file: 'packages/core/timeline-section/index.ts',
        code: timelineSectionSrc,
      },
    ],
    variants: [
      {
        name: 'Steps',
        node: <TimelineSectionDemo />,
        codeFile: 'timeline.tsx',
        code: `<TimelineSection
  steps={[
    { icon: CheckIcon, active: true },
    { icon: ClockIcon, active: true },
    { icon: CircleDashedIcon },
  ]}
>
  <div>Order placed</div>
  <div>Payment confirmed</div>
  <div>Awaiting shipment</div>
</TimelineSection>`,
      },
    ],
    dependencies: ['@/lib/utils'],
  },
]

export function docsByCategory(category: DocsCategory) {
  return docsRegistry.filter((entry) => entry.category === category)
}

export function findEntry(slug: string) {
  return docsRegistry.find((entry) => entry.slug === slug)
}
