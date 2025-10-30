import React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '../lib/utils.js';

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Root> {}

export function Avatar({ className, ...props }: AvatarProps) {
  return <RadixAvatar.Root className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props} />;
}

export interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Image> {}
export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return <RadixAvatar.Image className={cn('aspect-square h-full w-full', className)} {...props} />;
}

export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Fallback> {}
export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <RadixAvatar.Fallback
      className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium', className)}
      {...props}
    />
  );
}


