import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { m } from '#/paraglide/messages'

import { CodeBlock } from './code-block'

export interface UsageSource {
  file: string
  code: string
}

export interface UsageTabsProps {
  install: string
  usage: string
  sources: UsageSource[]
}

export function UsageTabs({ install, usage, sources }: UsageTabsProps) {
  return (
    <Tabs defaultValue="install" className="mt-6 gap-4">
      <TabsList variant="line">
        <TabsTrigger value="install">{m.docs_tab_install()}</TabsTrigger>
        <TabsTrigger value="source">{m.docs_tab_source()}</TabsTrigger>
      </TabsList>
      <TabsContent value="install" className="space-y-3">
        <CodeBlock code={install} filename={m.docs_tab_install()} />
        <CodeBlock code={usage} />
      </TabsContent>
      <TabsContent value="source" className="space-y-3">
        {sources.map((source) => (
          <CodeBlock
            key={source.file}
            code={source.code}
            filename={source.file}
          />
        ))}
      </TabsContent>
    </Tabs>
  )
}
