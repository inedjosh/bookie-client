import React, { ChangeEvent, FocusEvent } from "react";
import { cva, VariantProps } from "class-variance-authority";
import classNames from "classnames";

interface FormInputProps extends VariantProps<typeof selectClasses> {
  label?: string;
  name?: string;
  value: string;
  error?: string;
  options?: { value: string; key: string }[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  onFocus?: (e: FocusEvent<HTMLSelectElement>) => void;
  handleBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
  touched?: boolean;
}

const selectClasses = cva(
  "border px-3 py-2 h-[58px]  w-full text-sm appearance-none outline-none",
  {
    variants: {
      size: {
        sm: "py-2",
        md: "py-3",
        lg: "py-3",
      },
      hasError: {
        true: "border-primary-red focus:ring-assetize-primary focus:border-primary-blue",
        false: "border-[#D9D9D9] focus:ring-[#D9D9D9] focus:border-[#D9D9D9]",
      },
    },
    defaultVariants: {
      size: "lg",
      hasError: false,
    },
  }
);

const CustomSelect: React.FC<FormInputProps> = ({
  label = "",
  name,
  value,
  error,
  size = "lg",
  onChange,
  className,
  disabled = false,
  onFocus,
  touched = false,
  handleBlur,
  options,
}) => {
  const hasError = !!error && touched;

  return (
    <div>
      <div className="relative flex flex-col">
        {label && (
          <label className="text-sm font-bold" htmlFor={name}>
            {label}
          </label>
        )}
        <select
          className={classNames(selectClasses({ size, hasError }), className)}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={handleBlur}
          disabled={disabled}
        >
          {options &&
            options.map((item, index: number) => (
              <option key={index} value={item.value}>
                {item.key}
              </option>
            ))}
        </select>
      </div>
      {error && touched && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CustomSelect;
