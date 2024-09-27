import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ClipLoader } from "react-spinners";

const buttonVariants = cva(
  "inline-flex bg-primary  items-center px-[27px] justify-center shadow-md text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:bg-[#33333333] disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-foreground",
        destructive: "bg-[#ff4c4c] text-white hover:bg-destructive/90",
        outline:
          "border border-primary text-primary bg-white hover:bg-primary/90 hover:text-primary/80",
        secondary: "bg-secondary text-[#111111] hover:bg-secondary/80",
        ghost: "hover:bg-muted-alt hover:text-muted",
        link: "underline-offset-4 hover:underline text-primary",
        black: "bg-black text-white hover:bg-black/80",
      },
      size: {
        default: "h-10 h-[55px] py-2 px-4 w-full",
        sm: "h-[40px] px-2 w-full",
        lg: "h-11 h-[55px] px-8 ",
        full: "w-full ",
        auto: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? React.Fragment : "button";
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={asChild ? undefined : ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <ClipLoader color="#fff" size="20px" /> : children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
