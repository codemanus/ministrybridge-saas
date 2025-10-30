// Import Tailwind styles
import './styles.css';

// Utilities
export { cn } from './lib/utils.js';

// Theme
export { ThemeProvider } from './components/ThemeProvider.js';
export { ThemeToggle } from './components/ThemeToggle.js';

// Button
export { Button } from './primitives/Button.js';
export type { ButtonProps } from './primitives/Button.js';

// Card
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './primitives/Card.js';
export type { CardProps, CardHeaderProps, CardTitleProps, CardDescriptionProps, CardContentProps, CardFooterProps } from './primitives/Card.js';

// Dialog
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './primitives/Dialog.js';
export type { DialogProps, DialogTriggerProps, DialogContentProps, DialogHeaderProps, DialogTitleProps, DialogDescriptionProps, DialogFooterProps } from './primitives/Dialog.js';

// Form Controls
export { Input } from './primitives/Input.js';
export type { InputProps } from './primitives/Input.js';
export { Label } from './primitives/Label.js';
export type { LabelProps } from './primitives/Label.js';
export { Textarea } from './primitives/Textarea.js';
export type { TextareaProps } from './primitives/Textarea.js';
export { Checkbox } from './primitives/Checkbox.js';
export type { CheckboxProps } from './primitives/Checkbox.js';
export { Switch } from './primitives/Switch.js';
export type { SwitchProps } from './primitives/Switch.js';

// Display
export { Separator } from './primitives/Separator.js';
export type { SeparatorProps } from './primitives/Separator.js';
export { Badge } from './primitives/Badge.js';
export type { BadgeProps } from './primitives/Badge.js';
export { Avatar, AvatarImage, AvatarFallback } from './primitives/Avatar.js';
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps } from './primitives/Avatar.js';

// Tooltip
export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './primitives/Tooltip.js';
