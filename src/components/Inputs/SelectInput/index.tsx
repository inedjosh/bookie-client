import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const selectVariants = cva(
  "flex h-[58px] w-full bg-inputBg border rounded-[5px] border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0  disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-inputBg",
        ghost: "border-none shadow-none",
      },
      state: {
        error: "border-destructive",
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
);

interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string;
  touched?: boolean;
  handleBlur?: React.FocusEventHandler<HTMLSelectElement>;
  options?: { value: string; key: string }[];
}

const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    { className, label, error, touched, options = [], variant, ...props },
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
        <select
          className={selectVariants({
            variant,
            state: error && touched ? "error" : "default",
            className,
          })}
          ref={ref}
          {...props}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
        {error && touched && (
          <p className="mt-2 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

SelectInput.displayName = "SelectInput";

export { SelectInput, selectVariants };
