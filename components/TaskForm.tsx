import { useForm } from "react-hook-form";
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
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });


  async function onSubmit(data: CreateTaskInput) {
    await onCreate(data);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mb-4">
      <input
        {...register("title")}
        placeholder="Task title"
        className="border p-2 w-full"
      />
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}

      <input
        {...register("userId")}
        placeholder="User ID"
        className="border p-2 w-full"
      />

      <button className="bg-black text-white px-4 py-2">
         {isSubmitting ? "Adding..." : "Add task"}
      </button>
    </form>
  )

}

export default TaskForm

