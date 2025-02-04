import React, { useState, ChangeEvent, FocusEvent } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex h-[58px] w-full bg-inputBg border rounded-[5px] border-input px-3 py-2 text-sm file:border-0 file:bg-inputBg file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        focused: "border-border",
        error: "border-destructive focus-visible:ring-border-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof inputVariants> {
  label?: string;
  note?: string;
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

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, touched, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focus, setFocus] = useState(false);

    const handleTogglePassword = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    };

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
        <div className="relative">
          <input
            {...props}
            type={showPassword ? "text" : "password"}
            className={inputVariants({
              variant: error ? "error" : focus ? "focused" : "default",
              className,
            })}
            ref={ref}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground flex items-center justify-center bg-transparent rounded-[10px] border-none"
            onClick={handleTogglePassword}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        {error && touched && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput, inputVariants };
