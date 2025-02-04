import { useEffect, useRef, useState } from "react";
import { Typography } from "./Typography";
import { FiMoreVertical } from "react-icons/fi";
import { ReactNode } from "react";

interface TableProps<T = Record<string, ReactNode>> {
  data: T[]; // Accepts an array of CourseType or other generic types
  actions?: Array<{
    label: string;
    onClick: (row: T) => void;
  }>; // Static actions for all rows
  getActions?: (row: T) => Array<{
    label: string;
    onClick: () => void;
  }>; // Function to get actions dynamically
  hiddenFields?: string[]; // Fields to hide from display
}

const Table = <T extends Record<string, ReactNode>>({
  data,
  actions,
  getActions,
  hiddenFields = [],
}: TableProps<T>) => {
  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<string>("bottom");
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const headers =
    data.length > 0
      ? Object.keys(data[0]).filter((key) => !hiddenFields.includes(key))
      : [];

  const toggleTooltip = (index: number) => {
    if (openTooltipIndex === index) {
      setOpenTooltipIndex(null);
      return;
    }

    setOpenTooltipIndex(index);

    setTimeout(() => {
      if (tooltipRef.current) {
        const rect = tooltipRef.current.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          setTooltipPosition("top");
        } else {
          setTooltipPosition("bottom");
        }
      }
    }, 0);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setOpenTooltipIndex(null);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="overflow-x-auto rounded-[5px] border">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-4 text-left text-sm">
                <Typography variant="body">
                  <strong>
                    {" "}
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </strong>{" "}
                </Typography>
              </th>
            ))}
            {(actions || getActions) && (
              <th className="px-4 py-4 text-sm">
                <Typography variant="body">Actions</Typography>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white">
              {headers.map((header) => (
                <td
                  key={`${rowIndex}-${header}`}
                  className="border-t px-4 py-4 text-sm text-gray-600"
                >
                  <Typography variant="body">
                    {row[header as keyof T]}
                  </Typography>
                </td>
              ))}
              {(actions || getActions) && (
                <td className="relative border-t px-4 py-4 text-sm text-gray-600">
                  <button
                    className="p-2"
                    onClick={() => toggleTooltip(rowIndex)}
                  >
                    <FiMoreVertical size={18} />
                  </button>
                  {openTooltipIndex === rowIndex && (
                    <div
                      ref={tooltipRef}
                      className={`absolute ${
                        tooltipPosition === "bottom"
                          ? "bottom-[10%] mt-2"
                          : "bottom-[10%]  mb-2"
                      } right-0 w-40 z-10 rounded-[5px] bg-white shadow-lg border`}
                    >
                      {(getActions ? getActions(row) : actions || []).map(
                        (action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            onClick={() => {
                              action.onClick(row);
                              setOpenTooltipIndex(null);
                            }}
                          >
                            {action.label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
