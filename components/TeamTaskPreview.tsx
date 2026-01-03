

export default function TeamTaskPreview({ name, taskCount }: { name: string; taskCount: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
      <span className="text-xs font-semibold text-gray-500">{taskCount} tasks</span>
    </div>
  );
}