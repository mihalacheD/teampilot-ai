"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskClientInput,
  createTaskClientSchema,
} from "@/lib/validators/task";
import { useSession } from "next-auth/react";

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

  // 2. VERIFICĂRILE DE SECURITATE DUPĂ HOOK-URI

  // Opțional: arătăm un loader până se încarcă sesiunea
  if (status === "loading") return <p>Loading form...</p>;

  // Dacă nu e logat sau nu e MANAGER, nu afișăm nimic
  if (!session || session.user.role !== "MANAGER") {
    return null;
  }

  async function onSubmit(data: CreateTaskClientInput) {
    await onCreate(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mb-4 p-4 border rounded-lg bg-gray-50">
      <h2 className="font-bold text-lg">Add New Task</h2>
      {/* ... restul inputurilor tale ... */}
      <input
        {...register("title")}
        placeholder="Task title"
        className="border p-2 w-full rounded"
      />
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}

      <textarea
        {...register("description")}
        placeholder="Task description (optional)"
        className="border p-2 w-full text-sm rounded"
        rows={4}
      />

      <p className={`text-xs mt-1 text-right ${descriptionValue.length > 500 ? "text-red-500" : "text-gray-400"}`}>
        {descriptionValue.length}/500
      </p>

      <button
        disabled={isSubmitting}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add task"}
      </button>
    </form>
  );
};

export default TaskForm;