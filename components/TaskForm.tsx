"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskApiInput,
  CreateTaskClientInput,
  createTaskClientSchema,
} from "@/lib/validators/task";
import { useSession } from "next-auth/react";
import { Plus, Loader2, UserCircle, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type TaskFormProps = {
  onCreate: (data: CreateTaskApiInput) => Promise<void>;
};

const TaskForm = ({ onCreate }: TaskFormProps) => {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [employees, setEmployees] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    async function fetchEmployees() {
      const res = await fetch("/api/users");
      if (res.ok) {
        setEmployees(await res.json());
      }
    }

    fetchEmployees();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskClientInput>({
    resolver: zodResolver(createTaskClientSchema),
  });

  const descriptionValue = useWatch({ control, name: "description" }) || "";
  const titleValue = useWatch({ control, name: "title" }) || "";

  if (status === "loading") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "MANAGER") {
    return null;
  }

  const handleFormSubmit = async (data: CreateTaskClientInput) => {
    if (!selectedUserId) {
      return;
    }

    try {
      await onCreate({
        title: data.title,
        description: data.description,
        userId: selectedUserId,
        dueDate: data.dueDate ? data.dueDate : null,
      });

      reset();
      setSelectedUserId("");
      setIsOpen(false); // Close form after successful creation
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setSelectedUserId("");
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

  // Expanded Form State
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
          className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
            errors.title
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
            className={`text-xs font-medium ${
              titleValue.length > 50 ? "text-red-500" : "text-gray-400"
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
            className={`text-xs font-medium ${
              descriptionValue.length > 500 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {descriptionValue.length}/500
          </p>
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
      <div>
        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
          Assign to <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserCircle className="w-5 h-5 text-gray-400" />
          </div>

          <select
            id="assignee"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className={`w-full pl-10 pr-10 py-3 border rounded-xl outline-none transition-all appearance-none bg-white cursor-pointer ${
              !selectedUserId
                ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400 text-gray-400"
                : "border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            }`}
            required
          >
            <option value="" disabled>
              Select an employee to assign this task
            </option>
            {employees.map((u) => (
              <option key={u.id} value={u.id} className="text-gray-900">
                {u.name}
              </option>
            ))}
          </select>

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !selectedUserId}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create Task
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;