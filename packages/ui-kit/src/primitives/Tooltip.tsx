import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '../lib/utils.js';

export const TooltipProvider = RadixTooltip.Provider;
export const Tooltip = RadixTooltip.Root;
export const TooltipTrigger = RadixTooltip.Trigger;

export function TooltipContent({ className, sideOffset = 4, ...props }: RadixTooltip.TooltipContentProps) {
  return (
    <RadixTooltip.Content
      sideOffset={sideOffset}
      className={cn('z-50 overflow-hidden rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md', className)}
      {...props}
    />
  );
}


