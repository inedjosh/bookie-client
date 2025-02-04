import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill"; // Import ReactQuill directly (no dynamic import needed)

interface EditorProps {
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void; // Custom event for Formik compatibility
  onBlur: (e: { target: { name: string } }) => void; // Custom event for Formik compatibility
  error?: string;
  touched?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const Editor = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  label,
  placeholder,
  disabled = false,
}: EditorProps) => {
  // Handle change event for Formik
  const handleChange = (content: string) => {
    const event = {
      target: {
        name,
        value: content,
      },
    };
    onChange(event); // Call the onChange handler with the custom event
  };

  // Handle blur event for Formik
  const handleBlur = () => {
    const event = {
      target: {
        name,
      },
    };
    onBlur(event); // Call the onBlur handler with the custom event
  };

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#1f1f1f]">
          {label}
        </label>
      )}{" "}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly={disabled}
        placeholder={placeholder}
      />
      {error && touched && (
        <p className="mt-2 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
