import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[140px] w-full resize-none border-b border-[var(--color-border)] bg-transparent px-0 py-3 text-base text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] transition-colors duration-300 focus-visible:border-[var(--color-gold)] focus-visible:outline-none",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
