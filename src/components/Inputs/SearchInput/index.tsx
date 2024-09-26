import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { FaSearch } from "react-icons/fa"; // Importing the search icon

const inputVariants = cva(
  "flex h-[58px] w-full bg-inputBg border border-input px-3 py-2 text-sm file:border-0 file:bg-inputBg file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
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

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  placeholder?: string; // Optional placeholder
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { className, label, error, variant, placeholder = "Search...", ...props },
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
        <div className="flex items-center">
          <span className="absolute left-3 text-muted-foreground">
            {/* Search Icon from react-icons */}
            <FaSearch className="h-4 w-4" />
          </span>
          <input
            type="search"
            className={inputVariants({
              variant,
              state: error ? "error" : "default",
              className,
            })}
            ref={ref}
            placeholder={placeholder}
            style={{ paddingLeft: "2rem" }} // Add padding for the icon
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput, inputVariants };
