import React, { ChangeEvent, FocusEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const textareaVariants = cva(
  "flex min-h-[120px] w-full  border border-input bg-inputBg px-3 py-2 text-sm ring-offset-inputBg placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-inputBg",
        ghost: "border-none shadow-none",
      },
      state: {
        error: "border-destructive focus-visible:ring-destructive",
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "default",
    },
  }
);

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
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

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
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
            className="mb-2 block text-sm font-medium text-foreground"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <textarea
          className={textareaVariants({
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

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
