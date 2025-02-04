import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const typographyVariants = cva("", {
  variants: {
    variant: {
      heading:
        "font-extra-bold text-[32px] lg:text-[40px] leading-[44px] lg:leading-[54px] ",
      heading2: "font-bold  text-[22px] lg:text-[24px] leading-[32.44px]",
      subheading: "font-normal  text-[17px] lg:text-[20px] leading-[26px]",
      subheading2: "font-normal  text-[18px] lg:text-[18px] leading-[24px]",
      body: "font-normal text-[15px] md:text-[16px] leading-[16px] ",
      caption: "font-light text-[13px] lg:text-[14px]",
      xSmall: "font-light text-[11px] lg:text-[12px]",
      logo: "font-bold text-[30.43px] leading-[33.48px]",
      link: "font-normal text-[16.75px] leading-[22.82px] cursor-pointer hover:underline",
      underlined: "font-normal underline leading-[20px] text-[12px]",
    },
    color: {
      default: "text-black-text",
      primary: "text-primary",
      secondary: "text-secondary",
      secondary2: "text-primaryText",
      primaryGradient: "text-primaryGradient",
      muted: "text-muted",
      destructive: "text-destructive",
      accent: "text-accent",
      popover: "text-popover",
      card: "text-card",
      white: "text-white",
      black: "text-black",
      "muted-alt": "text-muted-alt",
      blackText: "black-text",
    },
    fontWeight: {
      normal: "font-normal",
      bold: "font-bold",
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
    fontWeight: "normal",
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
  fontWeight,
  children,
  ...props
}) => {
  return (
    <Tag
      className={typographyVariants({
        variant,
        color,
        maxWidth,
        fontWeight,
        className,
      })}
      {...props}
    >
      {children}
    </Tag>
  );
};

export { Typography, typographyVariants };
