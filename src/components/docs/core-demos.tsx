import { CheckIcon, CircleDashedIcon, ClockIcon } from 'lucide-react'

import {
  DetailLayout,
  createDetail,
  field,
  fieldsSection,
} from '@/components/module/detail-builder'
import {
  FormBuilder,
  FormPresets,
  saveFormConfigToJSON,
} from '@/components/module/form-builder'
import { ListView } from '@/components/module/list-view'
import { CTAButton } from '@/components/module/modal'
import { TimelineSection } from '@/components/module/timeline-section'

export function TimelineSectionDemo() {
  return (
    <TimelineSection
      steps={[
        { icon: CheckIcon, active: true },
        { icon: ClockIcon, active: true },
        { icon: CircleDashedIcon },
      ]}
    >
      <div className="pb-6 text-sm">Order placed</div>
      <div className="pb-6 text-sm">Payment confirmed</div>
      <div className="text-sm text-muted-foreground">Awaiting shipment</div>
    </TimelineSection>
  )
}

type DemoDoc = { id: string; title: string; status: string }

const demoDocs: DemoDoc[] = [
  { id: '1', title: 'Q3 Report', status: 'Draft' },
  { id: '2', title: 'Onboarding Guide', status: 'Published' },
  { id: '3', title: 'Product Roadmap', status: 'Published' },
]

export function ListViewDemo() {
  return (
    <div className="w-full">
      <ListView<DemoDoc>
        title="Documents"
        emptyMessage="No documents yet"
        query={{
          data: { pages: [{ data: demoDocs, has_more: false }] },
          isLoading: false,
          isFetchingNextPage: false,
          hasNextPage: false,
          fetchNextPage: async () => undefined,
        }}
        renderCard={(items) => (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {items.map((doc) => (
              <div key={doc.id} className="rounded-lg border border-rule p-3">
                <div className="text-sm font-medium">{doc.title}</div>
                <div className="text-xs text-ink-muted">{doc.status}</div>
              </div>
            ))}
          </div>
        )}
        renderList={(items) => (
          <ul className="divide-y divide-rule">
            {items.map((doc) => (
              <li key={doc.id} className="flex justify-between py-2 text-sm">
                <span>{doc.title}</span>
                <span className="text-ink-muted">{doc.status}</span>
              </li>
            ))}
          </ul>
        )}
      />
    </div>
  )
}

const contactForm = FormPresets.contactForm()

export const contactFormJson = (() => {
  try {
    return saveFormConfigToJSON(contactForm)
  } catch {
    return ''
  }
})()

export function FormBuilderDemo() {
  return (
    <div className="w-full max-w-md">
      <FormBuilder config={contactForm} />
    </div>
  )
}

type DemoInvoice = {
  id: string
  customer: string
  email: string
  status: string
  amount: string
}

const invoiceConfig = createDetail<DemoInvoice>()
  .withQueryKey((id) => ['demo-invoice', id])
  .withFetch(async () => ({
    id: 'inv_1024',
    customer: 'Acme Corporation',
    email: 'billing@acme.com',
    status: 'Paid',
    amount: '$1,200.00',
  }))
  .withHeader({
    title: (data) => data.customer,
    subtitle: (data) => data.email,
  })
  .withSections([
    fieldsSection<DemoInvoice>('overview', 'Overview', [
      field<DemoInvoice>('Customer', 'customer'),
      field<DemoInvoice>('Email', 'email'),
      field<DemoInvoice>('Status', 'status'),
      field<DemoInvoice>('Amount', 'amount'),
    ]),
  ])
  .build()

export function DetailBuilderDemo() {
  return (
    <div className="w-full">
      <DetailLayout id="inv_1024" config={invoiceConfig} />
    </div>
  )
}

export function ModalDemo() {
  return (
    <CTAButton config={{ label: 'New invoice', onClick: () => undefined }} />
  )
}
