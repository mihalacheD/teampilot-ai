import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, CreateTaskInput } from "@/lib/validators/task";


type TaskFormProps = {
  onCreate: (data: CreateTaskInput) => Promise<void>;
};

const TaskForm = ({ onCreate }: TaskFormProps) => {

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  const descriptionValue =
    useWatch({ control, name: "description" }) || "";


  async function onSubmit(data: CreateTaskInput) {
    await onCreate(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mb-4">

      <input
        {...register("userId")}
        placeholder="User ID"
        className="border p-2 w-full"
      />
      {errors.userId && (
        <p className="text-red-500 text-sm">{errors.userId.message}</p>
      )}

      <input
        {...register("title")}
        placeholder="Task title"
        className="border p-2 w-full"
      />
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}
      <textarea
        {...register("description")}
        placeholder="Task description (optional)"
        className="border p-2 w-full text-sm"
        rows={4}
      />
      <p
        className={`text-xs mt-1 text-right ${descriptionValue.length > 500
            ? "text-red-500"
            : "text-gray-400"
          }`}
      >
        {descriptionValue.length}/500
      </p>

      {errors.description && (
        <p className="text-red-500 text-xs mt-1">
          {errors.description.message}
        </p>
      )}


      <button className="bg-black text-white px-4 py-2">
        {isSubmitting ? "Adding..." : "Add task"}
      </button>
    </form>
  )

}

export default TaskForm

