import { Lock } from "lucide-react";
import { TaskItemProps } from "./index";

type Props = {
  task: TaskItemProps["task"];
  canEdit: boolean;
  currentUserId: string;
  assignedLabel: string;
  isExpanded: boolean;
  onExpand: (v: boolean) => void;
  onStartEdit: () => void;
};

export function ViewMode({
  task,
  canEdit,
  currentUserId,
  assignedLabel,
  isExpanded,
  onExpand,
  onStartEdit,
}: Props) {
  return (
    <div className="flex flex-col gap-1 min-w-0 w-full">
      {/* Titlu și Badge Assignee */}
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h3
          onClick={() => canEdit && onStartEdit()}
          className={`text-base font-semibold text-gray-900 wrap-break-word overflow-hidden ${
            canEdit ? "cursor-pointer hover:text-blue-600" : "cursor-default"
          } transition-colors`}
        >
          {task.title}
          {!canEdit && <Lock className="inline ml-2 w-3.5 h-3.5 text-gray-400" />}
        </h3>

        {task.user && (
          <span
            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
              task.userId === currentUserId
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-indigo-50 text-indigo-700 border-indigo-200"
            }`}
          >
            Assigned to {assignedLabel}
          </span>
        )}
      </div>

      {/* Descriere cu logică de Expand */}
      {task.description ? (
        <div className="mt-2">
          <p
            onClick={() => !isExpanded && canEdit && onStartEdit()}
            className={`text-sm text-gray-600 whitespace-pre-wrap wrap-break-word ${
              canEdit ? "cursor-pointer" : "cursor-default"
            } ${isExpanded ? "" : "line-clamp-2"}`}
          >
            {task.description}
          </p>
          {task.description.length > 100 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onExpand(!isExpanded);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1.5 inline-block"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      ) : (
        canEdit && (
          <p
            onClick={onStartEdit}
            className="text-xs text-gray-400 italic mt-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            Click to add description...
          </p>
        )
      )}
    </div>
  );
}