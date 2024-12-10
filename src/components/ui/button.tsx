"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === 'default' && "bg-black text-white hover:bg-black/80",
          variant === 'outline' && "border border-black text-black hover:bg-black/10",
          variant === 'ghost' && "hover:bg-black/10",
          variant === 'destructive' && "bg-red-600 text-white hover:bg-red-700",
          size === 'default' && "px-6 py-3",
          size === 'sm' && "px-4 py-2 text-xs",
          size === 'lg' && "px-8 py-4 text-base",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
