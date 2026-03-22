import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.28em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/12 bg-white/6 text-white/72",
        highlight: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
        ember: "border-orange-300/30 bg-orange-300/10 text-orange-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
