import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ClipLoader } from "react-spinners";

const buttonVariants = cva(
  "inline-flex bg-primary  items-center h-[40px] justify-center shadow-md text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:bg-[#33333333] disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-secondary-alt",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline:
          "border border-primary text-primary bg-white hover:bg-primary/90 hover:text-primary/80",
        secondary: "bg-secondary text-[#111111] hover:bg-secondary/80",
        ghost: "hover:bg-muted-alt hover:text-muted",
        link: "underline-offset-4 hover:underline text-primary",
        black: "bg-black text-white hover:bg-black/80",
      },
      size: {
        default: "h-10 h-[40px] py-2 px-4 w-full",
        sm: "h-[40px] px-2 w-full",
        lg: "w-full h-[54px] px-4 ",
      },

      borderRadius: {
        md: "rounded-[32px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      borderRadius: "md",
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
