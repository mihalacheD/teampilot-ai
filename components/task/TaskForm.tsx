"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskApiInput,
  CreateTaskClientInput,
  createTaskClientSchema,
} from "@/lib/validators/task";
import { useSession } from "next-auth/react";
import { Plus, Loader2, UserCircle, X, ChevronDown, Flag } from "lucide-react";
import { useState } from "react";
import { Priority, priorityLabels, priorityStyles } from "@/lib/constants/priority";
import useEmployee from "@/hooks/useEmployee";

type TaskFormProps = {
  onCreate: (data: CreateTaskApiInput) => Promise<void>;
};

const TaskForm = ({ onCreate }: TaskFormProps) => {
  const { data: session, status } = useSession();
  const { employees } = useEmployee();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskClientInput>({
    resolver: zodResolver(createTaskClientSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      userId: "",
      dueDate: "",
    }
  });

  const descriptionValue = useWatch({ control, name: "description" }) || "";
  const titleValue = useWatch({ control, name: "title" }) || "";

  if (status === "loading") return null;
  if (!session || session.user.role !== "MANAGER") return null;

  const handleFormSubmit = async (data: CreateTaskClientInput) => {
    await onCreate({
      ...data,
      dueDate: data.dueDate || null,
    });

    reset();
    setIsOpen(false);
  };

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

  // Collapsed Button State
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl p-6 transition-all shadow-sm hover:shadow-md group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">Create New Task</h3>
              <p className="text-blue-100 text-sm">Assign a task to your team members</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-blue-100 group-hover:translate-y-0.5 transition-transform" />
        </div>
      </button>
    );
  }

  // EXPANDED FORM
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      {/* Form Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Task Title <span className="text-red-500">*</span>
        </label>

        <input
          id="title"
          {...register("title")}
          placeholder="Enter task title..."
          className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${errors.title
            ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
            : "border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            }`}
        />

        <div className="flex justify-between items-center mt-1.5">
          {errors.title ? (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <span className="text-red-500">•</span>
              {errors.title.message}
            </p>
          ) : (
            <div></div>
          )}
          <p
            className={`text-xs font-medium ${titleValue.length > 50 ? "text-red-500" : "text-gray-400"
              }`}
          >
            {titleValue.length}/50
          </p>
        </div>
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Add task details, requirements, or notes..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none"
          rows={4}
        />
        <div className="flex justify-between items-center mt-1.5">
          <p className="text-xs text-gray-500">
            Provide context to help team members understand the task
          </p>
          <p
            className={`text-xs font-medium ${descriptionValue.length > 500 ? "text-red-500" : "text-gray-400"
              }`}
          >
            {descriptionValue.length}/500
          </p>
        </div>
      </div>

      {/* Priority Selector */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
          Priority <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(["LOW", "MEDIUM", "HIGH", "URGENT"] as Priority[]).map((priority) => (
            <label
              key={priority}
              className="relative cursor-pointer"
            >
              <input
                type="radio"
                value={priority}
                {...register("priority")}
                className="peer sr-only"
              />
              <div className={`
                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                peer-checked:ring-2 peer-checked:ring-offset-2
                ${priority === "LOW" ? "border-gray-200 peer-checked:border-gray-400 peer-checked:ring-gray-300" : ""}
                ${priority === "MEDIUM" ? "border-blue-200 peer-checked:border-blue-500 peer-checked:ring-blue-300" : ""}
                ${priority === "HIGH" ? "border-orange-200 peer-checked:border-orange-500 peer-checked:ring-orange-300" : ""}
                ${priority === "URGENT" ? "border-red-200 peer-checked:border-red-500 peer-checked:ring-red-300" : ""}
                peer-checked:${priorityStyles[priority]}
              `}>
                <Flag className={`w-4 h-4 mb-1 ${priority === "LOW" ? "text-gray-500" :
                  priority === "MEDIUM" ? "text-blue-500" :
                    priority === "HIGH" ? "text-orange-500" :
                      "text-red-500"
                  }`} />
                <span className="text-xs font-medium">{priorityLabels[priority]}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
          Due date <span className="text-gray-400 text-xs">(optional)</span>
        </label>

        <input
          type="date"
          id="dueDate"
          {...register("dueDate")}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none
            focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all bg-white"
        />
      </div>

      {/* User Assignment Dropdown */}
      <div className="relative">
        <UserCircle className="absolute left-3 top-3.5 text-gray-400" />
        <select
          {...register("userId")}
          className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white"
        >
          <option value="">Select employee</option>
          {employees.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        {errors.userId && (
          <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 px-6 py-3 bg-gray-100 rounded-xl"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl"
        >
          {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;