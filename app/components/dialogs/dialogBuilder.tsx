'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { Spinner } from '~/components/ui/spinner'

type DialogVariant = 'default' | 'danger' | 'info' | 'success'
type ScrollBehavior = 'inside' | 'outside' | 'none'
type ActionAlignment = 'left' | 'right' | 'center' | 'between'

type DialogBuilderProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  beforeClose?: () => boolean | Promise<boolean>

  trigger?: React.ReactNode
  title?: React.ReactNode
  titleAlign?: 'left' | 'center' | 'right'
  description?: React.ReactNode
  icon?: React.ReactNode

  modal?: boolean
  portal?: boolean
  closeOnOutsideClick?: boolean
  disableEscapeKeyDown?: boolean
  disableCloseButton?: boolean
  variant?: DialogVariant
  unstyled?: boolean
  scrollBehavior?: ScrollBehavior

  loading?: boolean

  formProps?: React.FormHTMLAttributes<HTMLFormElement>
  asForm?: boolean

  footer?: React.ReactNode
  footerProps?: {
    className?: string
    align?: ActionAlignment
  }

  children?: React.ReactNode
  contentClassName?: string
  width?: string
  maxWidth?: string
}

export function DialogBuilder({
  open,
  onOpenChange,
  onClose,
  beforeClose,

  trigger,
  title,
  titleAlign = 'left',
  description,
  icon,

  modal = true,
  portal = true,
  closeOnOutsideClick = true,
  disableEscapeKeyDown = false,
  disableCloseButton = false,
  variant = 'default',
  unstyled = false,
  scrollBehavior = 'inside',

  loading = false,

  formProps,
  asForm = false,

  footer,
  footerProps,

  children,
  contentClassName,
  width = 'w-full',
  maxWidth = 'max-w-xl'
}: DialogBuilderProps) {
  const handleOpenChange = async (next: boolean) => {
    if (!next && beforeClose) {
      const result = await beforeClose()
      if (!result) return
    }

    onOpenChange?.(next)
    if (!next) onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={modal}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          width,
          maxWidth,
          {
            'overflow-hidden': scrollBehavior === 'none',
            'overflow-y-auto': scrollBehavior === 'outside',
          },
          variant === 'danger' && 'bg-red-50',
          variant === 'info' && 'bg-blue-50',
          variant === 'success' && 'bg-green-50',
          unstyled ? '' : 'rounded-lg shadow-xl',
          contentClassName
        )}
        onInteractOutside={closeOnOutsideClick ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={disableEscapeKeyDown ? (e) => e.preventDefault() : undefined}
        showCloseButton={!disableCloseButton}
      >
        {(title || description || icon) && (
          <DialogHeader className={cn(titleAlign === 'center' && 'items-center')}>
            <div className="flex items-start gap-3">
              {icon && <div className="mt-1">{icon}</div>}
              <div className={cn(titleAlign === 'center' && 'text-center w-full')}>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && <DialogDescription>{description}</DialogDescription>}
              </div>
            </div>
          </DialogHeader>
        )}
        {asForm && formProps ? (
          <form {...formProps}>
            <DialogContentInner
              children={children}
              footer={footer}
              footerProps={footerProps}
              loading={loading}
            />
          </form>
        ) : (
          <DialogContentInner
            children={children}
            footer={footer}
            footerProps={footerProps}
            loading={loading}
          />
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50 rounded-lg">
            <Spinner className="w-6 h-6" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function DialogContentInner({
  children,
  footer,
  footerProps,
  loading
}: {
  children: React.ReactNode
  footer?: React.ReactNode
  footerProps?: DialogBuilderProps['footerProps']
  loading?: boolean
}) {
  return (
    <>
      <div className="relative">{children}</div>
      {footer && (
        <DialogFooter
          className={cn(
            {
              'justify-end': footerProps?.align === 'right',
              'justify-start': footerProps?.align === 'left',
              'justify-center': footerProps?.align === 'center',
              'justify-between': footerProps?.align === 'between',
            },
            footerProps?.className
          )}
        >
          {React.Children.map(footer, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child as any, {
                disabled: loading || ((child.props as { disabled: boolean })?.disabled ?? false)
              })
              : child
          )}
        </DialogFooter>
      )}
    </>
  )
}
