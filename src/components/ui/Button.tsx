import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type Variant = "solid" | "outline" | "ghost";

const variantClasses: Record<Variant, string> = {
  solid: "bg-hot text-ink hover:bg-violet",
  outline: "border border-paper text-paper hover:border-hot hover:text-hot",
  ghost: "text-paper hover:text-hot",
};

const base =
  "inline-flex items-center justify-center gap-2 px-6 py-3 type-meta text-meta transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hot";

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: MouseEventHandler;
  disabled?: boolean;
};

export function Button({
  children,
  variant = "solid",
  className = "",
  href,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${className}`.trim();

  if (href && disabled) {
    return (
      <span aria-disabled="true" className={`${classes} opacity-50`}>
        {children}
      </span>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
