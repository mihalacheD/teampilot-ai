import { Priority, PRIORITIES } from "@/lib/constants/priority";

interface PriorityFilterProps {
  current: Priority | "ALL";
  onChange: (value: Priority | "ALL") => void;
}

export function PriorityFilter({ current, onChange }: PriorityFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 ">
      <FilterButton
        label="All"
        active={current === "ALL"}
        onClick={() => onChange("ALL")}
      />
      {PRIORITIES.map((p) => (
        <FilterButton
          key={p}
          label={p}
          active={current === p}
          onClick={() => onChange(p)}
          variant="blue"
        />
      ))}
    </div>
  );
}

function FilterButton({ label, active, onClick, variant = "dark" }: {
  label: string;
  active: boolean;
  onClick: () => void;
  variant?: "dark" | "blue";
}) {
  const activeClass = variant === "dark" ? "bg-gray-900 border-gray-900" : "bg-blue-600 border-blue-600";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all ${active
          ? `${activeClass} text-white shadow-sm`
          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        }`}
    >
      {label}
    </button>
  );
}