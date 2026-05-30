import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { Picker } from './picker'

const meta = {
  title: 'Compose/Picker',
  component: Picker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: fn() },
} satisfies Meta<typeof Picker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 'day',
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
}

export const TwoOptions: Story = {
  args: {
    value: 'grid',
    options: [
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List' },
    ],
  },
}
