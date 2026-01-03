


export default function TaskPreview({ title, status }: { title: string; status: string }) {
  const statusColors = {
    "To Do": "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    "Done": "bg-green-100 text-green-700",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <span className="text-sm text-gray-700 truncate flex-1">{title}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2 ${statusColors[status as keyof typeof statusColors]}`}>
        {status}
      </span>
    </div>
  );
}