import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva();

interface CustomCheckboxProps extends VariantProps<typeof checkboxVariants> {
  onChange: (option: any) => void;
  value: string | number | readonly string[] | undefined;
  label: React.ReactNode;
  isChecked?: boolean;
  className?: string;
}

const CustomCheckbox = React.forwardRef<HTMLSelectElement, CustomCheckboxProps>(
  ({ onChange, value, label, isChecked, className, ...props }) => {
    return (
      <div className={`${checkboxVariants({ className })} flex items-center`}>
        <input
          type="checkbox"
          onChange={onChange}
          value={value}
          checked={isChecked}
          className="cursor-pointer"
          {...props}
        />
        {label && <div className="text-[1.1rem] font-medium pl-3">{label}</div>}
      </div>
    );
  }
);

CustomCheckbox.displayName = "CustomCheckbox";

export { CustomCheckbox, checkboxVariants };
