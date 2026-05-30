import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Tag } from './tag'

const meta = {
  title: 'Compose/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Soft: Story = {
  args: {
    variant: 'soft',
    children: 'Draft',
  },
}

export const Solid: Story = {
  args: {
    variant: 'solid',
    children: 'Published',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Archived',
  },
}

export const Removable: Story = {
  args: {
    variant: 'soft',
    children: 'Design',
    onRemove: fn(),
  },
}
