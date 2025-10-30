import React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { cn } from '../lib/utils.js';
import { Check } from 'lucide-react';

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {}

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <RadixCheckbox.Root
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-input shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        className
      )}
      {...props}
    >
      <RadixCheckbox.Indicator className={cn('flex items-center justify-center text-current')}>
        <Check className="h-3.5 w-3.5" />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
}


