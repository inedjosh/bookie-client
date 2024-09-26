import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { IoIosArrowBack } from "react-icons/io";

const goBackVariants = cva("flex items-center cursor-pointer", {
  variants: {
    variant: {
      withBackground: "bg-gray-200 hover:bg-gray-300",
      default: "text-black",
      primary: "text-primary",
      secondary: "text-secondary",
    },
    size: {
      sm: "p-2 text-sm",
      md: "p-3 text-[16px] font-[500]",
      lg: "p-4 text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

interface GoBackProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof goBackVariants> {
  onBack: () => void;
  text: string;
}

const GoBack: React.FC<GoBackProps> = ({
  onBack,
  text,
  variant,
  size,
  className,
  ...props
}) => {
  return (
    <button
      onClick={onBack}
      className={goBackVariants({
        variant,
        size,
        className,
      })}
      {...props}
    >
      <IoIosArrowBack className="mr-2" />
      <span>{text}</span>
    </button>
  );
};

export { GoBack, goBackVariants };
