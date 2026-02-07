"use client";

import { Filter } from "lucide-react";
import { PriorityFilter } from "@/components/task/PriorityFilter";
import { SortDropdown, SortOption } from "@/components/task/Sortdropdown";
import { Priority } from "@/lib/constants/priority";
import { useState } from "react";

interface FilterSortBarProps {
  priorityFilter: Priority | "ALL";
  onPriorityChange: (value: Priority | "ALL") => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  taskCount: number;
}

export function FilterSortBar({
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortChange,
  taskCount,
}: FilterSortBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Mobile: Toggle Button + Sort */}
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm"
        >
          <Filter className="w-4 h-4 text-gray-500" />
          <span>Filters</span>
          {priorityFilter !== "ALL" && (
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </button>
        <SortDropdown current={sortBy} onChange={onSortChange} />
      </div>

      {/* Desktop: Filters + Sort in one row */}
      <div className="hidden sm:flex items-center justify-between gap-4">
        <PriorityFilter current={priorityFilter} onChange={onPriorityChange} />
        <SortDropdown current={sortBy} onChange={onSortChange} />
      </div>

      {/* Mobile: Collapsible Filters */}
      {showFilters && (
        <div className="sm:hidden animate-in slide-in-from-top-2 duration-200">
          <PriorityFilter current={priorityFilter} onChange={onPriorityChange} />
        </div>
      )}

      {/* Task Count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
          {priorityFilter !== "ALL" && (
            <span className="text-gray-400 ml-1">
              · {priorityFilter.toLowerCase()} priority
            </span>
          )}
        </span>
      </div>
    </div>
  );
}