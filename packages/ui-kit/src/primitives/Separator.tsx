import React from 'react';
import * as RadixSeparator from '@radix-ui/react-separator';
import { cn } from '../lib/utils.js';

export interface SeparatorProps extends RadixSeparator.SeparatorProps {}

export function Separator({ className, orientation = 'horizontal', decorative = true, ...props }: SeparatorProps) {
  return (
    <RadixSeparator.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
      {...props}
    />
  );
}


