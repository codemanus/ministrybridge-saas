import React from 'react';
import * as RadixLabel from '@radix-ui/react-label';
import { cn } from '../lib/utils.js';

export interface LabelProps extends RadixLabel.LabelProps {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <RadixLabel.Root
      className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    />
  );
}


