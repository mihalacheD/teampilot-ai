import { ArrowUpDown, Calendar, Flag, CheckCircle2, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export type SortOption =
  | "priority-desc"
  | "priority-asc"
  | "dueDate-asc"
  | "dueDate-desc"
  | "status-asc"
  | "createdAt-desc";

interface SortDropdownProps {
  current: SortOption;
  onChange: (value: SortOption) => void;
}

const sortOptions = [
  {
    value: "priority-desc" as SortOption,
    label: "Priority: High to Low",
    icon: <Flag className="w-4 h-4" />,
  },
  {
    value: "priority-asc" as SortOption,
    label: "Priority: Low to High",
    icon: <Flag className="w-4 h-4" />,
  },
  {
    value: "dueDate-asc" as SortOption,
    label: "Due Date: Soonest First",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    value: "dueDate-desc" as SortOption,
    label: "Due Date: Latest First",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    value: "status-asc" as SortOption,
    label: "Status: To-Do First",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    value: "createdAt-desc" as SortOption,
    label: "Recently Created",
    icon: <Clock className="w-4 h-4" />,
  },
];

export function SortDropdown({ current, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = sortOptions.find((opt) => opt.value === current);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm"
      >
        <ArrowUpDown className="w-4 h-4 text-gray-500" />
        <span className="hidden sm:inline">Sort:</span>
        <span className="font-semibold text-gray-900">
          {currentOption?.label.split(":")[0] || "Priority"}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Sort By
            </div>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${current === option.value
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span
                  className={
                    current === option.value ? "text-blue-600" : "text-gray-400"
                  }
                >
                  {option.icon}
                </span>
                <span className="flex-1 text-left">{option.label}</span>
                {current === option.value && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}