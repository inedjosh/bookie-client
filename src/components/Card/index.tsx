import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "transition-all duration-300 ease-in-out", // Base styles
  {
    variants: {
      variant: {
        default: "bg-white",
        plain: "",
        outlined: "bg-white border-[1px] border",
        "outlined-dotted": "bg-white border-[1px] border-dotted border-[#EEE]",
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-white",
        muted: "bg-border text-blackText",
        dark: "bg-[#1E1E1E] ",
      },
      padding: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        none: "p-0",
      },
      borderRadius: {
        none: "rounded-none",
        md: "rounded-[32px]",
        lg: "rounded-[50px]",
      },
      hoverEffect: {
        none: "",
        shadow: "hover:shadow-xl",
        scale: "hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "sm",
      borderRadius: "md",
      hoverEffect: "none",
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant,
      padding,
      borderRadius,
      hoverEffect,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref} // Pass the ref here
        style={{ boxShadow: "0px 4px 10px 0px #8A8E940D" }}
        className={cardVariants({
          variant,
          padding,
          borderRadius,
          hoverEffect,
          className,
        })}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card"; // Add a display name for debugging purposes
export default Card;
