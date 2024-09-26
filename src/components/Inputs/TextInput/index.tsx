import React, { ChangeEvent, FocusEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex h-[58px] w-full bg-inputBg  border border-input  px-3 py-2 text-sm file:border-0 file:bg-inputBg file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-inputBg",
        ghost: "border-none shadow-none",
      },
      state: {
        error: "border-destructive ",
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  touched?: boolean;
  handleBlur?: (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | FocusEvent<HTMLSelectElement>
  ) => void;
  onFocus?: (
    e:
      | FocusEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | FocusEvent<HTMLSelectElement>
  ) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      variant,
      onFocus,
      handleBlur,
      touched,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative">
        {label && (
          <label
            className="mb-2 block text-sm font-medium text-[#1f1f1f]"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={inputVariants({
            variant,
            state: error ? "error" : "default",
            className,
          })}
          ref={ref}
          onFocus={onFocus}
          onBlur={handleBlur}
          {...props}
        />
        {error && touched && (
          <p className="mt-2 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
