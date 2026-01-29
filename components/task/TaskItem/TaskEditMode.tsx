import { Save, X } from "lucide-react";

type Props = {
  title: string;
  description: string;
  onTitleChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function EditMode({ title, description, onTitleChange, onDescChange, onSave, onCancel }: Props) {
  return (
    <div className="space-y-3">
      <input
        autoFocus
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="w-full px-4 py-2 text-base font-semibold border-2 border-blue-400 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
      />
      <textarea
        value={description}
        onChange={(e) => onDescChange(e.target.value)}
        className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
        rows={3}
      />
      <div className="flex gap-2">
        <button onClick={onSave} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
          <Save className="w-3.5 h-3.5" /> Save
        </button>
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </div>
  );
}