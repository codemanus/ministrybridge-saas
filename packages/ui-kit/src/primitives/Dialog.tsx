import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import clsx from 'clsx';

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  );
}

export interface DialogTriggerProps extends DialogPrimitive.DialogTriggerProps {
  children: React.ReactNode;
}

export function DialogTrigger({ children, ...props }: DialogTriggerProps) {
  return (
    <DialogPrimitive.Trigger {...props}>
      {children}
    </DialogPrimitive.Trigger>
  );
}

export interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  children: React.ReactNode;
}

export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        className={clsx(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DialogHeader({ className, children, ...props }: DialogHeaderProps) {
  return (
    <div className={clsx('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props}>
      {children}
    </div>
  );
}

export interface DialogTitleProps extends DialogPrimitive.DialogTitleProps {
  children: React.ReactNode;
}

export function DialogTitle({ className, children, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      className={clsx('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

export interface DialogDescriptionProps extends DialogPrimitive.DialogDescriptionProps {
  children: React.ReactNode;
}

export function DialogDescription({ className, children, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      className={clsx('text-sm text-gray-500', className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
}

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function DialogFooter({ className, children, ...props }: DialogFooterProps) {
  return (
    <div className={clsx('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props}>
      {children}
    </div>
  );
}

export const DialogClose = DialogPrimitive.Close;
