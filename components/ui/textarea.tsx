import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea Component
 * 
 * A customized textarea component with consistent styling across the application.
 * This component extends the native HTML textarea with FableMind AI's design system.
 * 
 * Features:
 * - Responsive design with tailored styling for different device sizes
 * - Consistent focus and hover states
 * - Support for validation states (valid/invalid)
 * - Accessible design with proper ARIA attributes
 * - Dark mode compatibility
 * 
 * @param props - Standard textarea props extended with:
 *   - className: Additional CSS classes to apply to the textarea
 * 
 * @example
 * ```tsx
 * <Textarea 
 *   placeholder="Write your story prompt here..."
 *   value={storyPrompt}
 *   onChange={e => setStoryPrompt(e.target.value)}
 *   className="h-40"
 * />
 * ```
 * 
 * @returns A styled textarea element
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
