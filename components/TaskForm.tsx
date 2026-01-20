"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskApiInput,
  CreateTaskClientInput,
  createTaskClientSchema,
} from "@/lib/validators/task";
import { useSession } from "next-auth/react";
import { Plus, Loader2, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

type TaskFormProps = {
  onCreate: (data: CreateTaskApiInput) => Promise<void>;
};

const TaskForm = ({ onCreate }: TaskFormProps) => {
  const { data: session, status } = useSession();

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
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-3"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
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
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
    >
      {/* Form Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
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
      focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
        />
      </div>


      {/* User Assignment Dropdown - STILIZAT */}
      <div>
        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-2">
          Assign to <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          {/* Icon stânga */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserCircle className="w-5 h-5 text-gray-400" />
          </div>

          {/* Dropdown */}
          <select
            id="assignee"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className={`w-full pl-10 pr-10 py-3 border rounded-xl outline-none transition-all appearance-none bg-white cursor-pointer ${!selectedUserId
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
                {u.name} • {u.email}
              </option>
            ))}
          </select>

          {/* Chevron icon dreapta */}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !selectedUserId}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Task...
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Create Task
          </>
        )}
      </button>
    </form>
  );
};

export default TaskForm;