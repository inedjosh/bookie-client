import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const typographyVariants = cva("", {
  variants: {
    variant: {
      heading:
        "font-bold text-[24px] leading-[36px] md:text-[36px] lg:leading-[40px]",
      heading2: "font-bold text-[28.46px] leading-[32.44px]",
      subheading2: "font-normal text-[18px] leading-[24px]",
      subheading: "font-normal text-[20px] leading-[26px]",
      body: "font-normal text-[16px] leading-[18px] ",
      caption: "font-normal text-[12px]",
      logo: "font-bold text-[30.43px] leading-[33.48px]",
      link: "font-normal text-[16.75px] leading-[22.82px] cursor-pointer hover:underline",
      underlined: "font-normal underline leading-[20px] text-[12px]",
    },
    color: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-muted",
      destructive: "text-destructive",
      accent: "text-accent",
      popover: "text-popover",
      card: "text-card",
      black: "text-black",
      "muted-alt": "text-muted-alt",
    },
    maxWidth: {
      none: "max-w-none",
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "default",
    maxWidth: "none",
  },
});

interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

const Typography: React.FC<TypographyProps> = ({
  as: Tag = "p",
  variant,
  color,
  maxWidth,
  className,
  children,
  ...props
}) => {
  return (
    <Tag
      className={typographyVariants({ variant, color, maxWidth, className })}
      {...props}
    >
      {children}
    </Tag>
  );
};

export { Typography, typographyVariants };
