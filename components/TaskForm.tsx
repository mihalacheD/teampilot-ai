"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskClientInput,
  createTaskClientSchema,
} from "@/lib/validators/task";
import { useSession } from "next-auth/react";
import { Plus, Loader2 } from "lucide-react";

type TaskFormProps = {
  onCreate: (data: CreateTaskClientInput) => Promise<void>;
};

const TaskForm = ({ onCreate }: TaskFormProps) => {
  const { data: session, status } = useSession();
  
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

  async function onSubmit(data: CreateTaskClientInput) {
    try {
      await onCreate(data);
      reset();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-2">
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
          className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
            errors.title
              ? "border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400"
              : "border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
            <span className="text-red-500">•</span>
            {errors.title.message}
          </p>
        )}
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
          <p className={`text-xs font-medium ${
            descriptionValue.length > 500 ? "text-red-500" : "text-gray-400"
          }`}>
            {descriptionValue.length}/500
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
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