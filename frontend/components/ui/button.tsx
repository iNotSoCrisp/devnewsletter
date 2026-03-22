"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-[0.02em] transition-all duration-300 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 focus-visible:ring-2 focus-visible:ring-white/20",
  {
    variants: {
      variant: {
        default:
          "bg-white text-slate-950 shadow-[0_18px_48px_rgba(255,255,255,0.12)] hover:-translate-y-0.5 hover:bg-[#dffcff]",
        secondary:
          "border border-white/12 bg-white/6 text-white hover:-translate-y-0.5 hover:border-white/22 hover:bg-white/10",
        ghost:
          "text-white/82 hover:bg-white/8 hover:text-white",
      },
      size: {
        default: "h-11 px-5 py-2",
        lg: "h-13 px-7 py-3 text-[0.95rem]",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
