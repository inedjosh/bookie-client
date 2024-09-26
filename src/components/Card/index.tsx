import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "transition-all duration-300 ease-in-out", // Base styles
  {
    variants: {
      variant: {
        default: "bg-white",
        plain: "",
        outlined: "bg-white border border-[#EEE]",
        "outlined-dotted": "bg-white border-[1px] border-dotted border-[#EEE]",
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-white",
      },
      padding: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        none: "p-0",
      },
      borderRadius: {
        none: "rounded-none",
      },
      hoverEffect: {
        none: "",
        shadow: "hover:shadow-xl",
        scale: "hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      borderRadius: "none",
      hoverEffect: "none",
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card: React.FC<CardProps> = ({
  variant,
  padding,
  borderRadius,
  hoverEffect,
  className,
  children,
  ...props
}) => {
  return (
    <div
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
};

export default Card;
