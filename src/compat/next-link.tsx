import type { AnchorHTMLAttributes, ReactNode } from 'react'

export interface NextLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string
  children?: ReactNode
}

export default function NextLink({ href, children, ...props }: NextLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
