import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full border-b border-[var(--color-border)] bg-transparent px-0 py-3 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] transition-colors duration-300 focus-visible:border-[var(--color-gold)] focus-visible:outline-none",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
